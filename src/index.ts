import { Application } from "probot"; // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.log("app is being served");
  app.on("issues.opened", async (context) => {
    const message = `Thanks for opening this issue!:tada:
    You are awesome..`;
    const issueComment = context.issue({
      body: message,
    });
    await context.github.issues.createComment(issueComment);
  });
};
