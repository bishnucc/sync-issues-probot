import { Application } from "probot"; // eslint-disable-line no-unused-vars
const recastai = require("recastai").default;

const getLabel = (result: any) => {
  let label = undefined;
  if (result.isAssert()) {
    label = "bug";
  } else if (result.isCommand()) {
    label = "enhancement";
  } else if (result.isWhQuery() || result.isYnQuery()) {
    label = "question";
  }
  return label;
};

export = (app: Application) => {
  app.on(["issues.opened", "issues.edited"], async (context) => {
    const request = new recastai.request(process.env.RECASTAI_TOKEN);
    const {
      payload: {
        issue: { title, user },
        action,
      },
    } = context;
    console.log({ context });
    const message = `Thanks @${user.login} for ${
      action === "edited" ? "editing" : "opening"
    } this issue.`;
    const issueComment = context.issue({
      body: message,
    });
    await context.github.issues.createComment(issueComment);

    const result = await request.analyseText(title);
    const label = getLabel(result);

    if (label) {
      const params = context.issue({
        labels: [label],
      });
      await context.github.issues.addLabels(params);
    }
  });
};
