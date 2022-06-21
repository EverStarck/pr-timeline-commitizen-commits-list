const core = require("@actions/core");
const github = require("@actions/github");

const main = async () => {
  try {
    const token = core.getInput("github-token", { required: true });
    const owner = core.getInput("owner", { required: true });
    const repo = core.getInput("repo", { required: true });
    const pull_number = core.getInput("pull_number", { required: true });
    const update_body = core.getInput("update_body", { required: true });

    const octokit = new github.getOctokit(token);
    // octokit get List commits on a pull request
    const commits = await octokit.rest.pulls.listCommits({
      owner,
      repo,
      pull_number,
    });

    // Filter commits
    const commitizenKeys = {
      feat: "Features",
      fix: "Bug Fixes",
      perf: "Performance Improvements",
      docs: "Documentation",
      test: "Tests",
      refactor: "Code Refactoring",
      build: "Internal Workflow",
      ci: "Internal Workflow",
      revert: "Reverts",
      chore: "Chore",
      style: "Style",
    };
    const regex = new RegExp(
      `^(${Object.keys(commitizenKeys).join("|")})(\\((.+)\\))?: (.+\\S)`
    );

    const history = {};

    for (const commit of commits.data) {
      const match = commit.commit.message.match(regex);

      if (match) {
        // Make first letter upper case
        match[4] = match[4].charAt(0).toUpperCase() + match[4].slice(1);

        history[match[3] || "General"] = {
          ...(history[match[3] || "General"] || []),
          [match[1]]: [
            ...(history[match[3] || "General"]?.[match[1]] || []),
            {
              subject: match[4],
              sha: commit.sha,
            },
          ],
        };
      }
    }

    let result = "";

    for (const key in history) {
      result += `## ${key}\n\n`;

      Object.keys(commitizenKeys).forEach((action) => {
        if (history[key][action]) {
          result += `### ${commitizenKeys[action]}\n\n`;
          history[key][action].forEach((commit) => {
            result += `- ${commit.subject} (${commit.sha})\n`;
          });
          result += "\n";
        }
      })
    }

    // Change pull request body
    if (update_body) {
      octokit.rest.pulls.update({
        owner,
        repo,
        pull_number,
        body: result,
      });
    }

    core.setOutput("pull-request-body", result);
  } catch (error) {
    console.log("error");
    core.setFailed(error.message);
  }
};

// Call the main function to run the action
main();
