# PR Timeline Commitizen Commits List

This action updates the body of a pull request with the commit history.

![Screenshot](https://user-images.githubusercontent.com/51029456/218279143-2fcf8ab4-be51-4263-a30f-5ca40af40826.png)

## Inputs

| Name         | Description                                            | Required |
| ------------ | ------------------------------------------------------ | -------- |
| github-token | Secret GitHub API token to use for making API requests | ✅       |
| owner        | The name of the owner of the github repository         | ✅       |
| repo         | The name of the github repository                      | ✅       |
| pull_number  | The pull request number                                | ✅       |
| update_body  | Update PR body with output. Default is `true`          | ❌       |

## Outputs

| Name              | Description                         |
| ----------------- | ----------------------------------- |
| pull-request-body | Return markdown with commit history |

## Example

### Action

Easy to use **PR Timeline Commitizen Commits List** by add [github workflow file](https://docs.github.com/en/actions/quickstart)

```yml
name: Update PR Body
on:
  pull_request:
    branches: ["main"]

jobs:
  update-body:
    permissions: write-all
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update PR Body
        uses: EverStarck/pr-timeline-commitizen-commits-list@v1.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          owner: EverStarck
          repo: project
          pull_number: ${{ github.event.number }}
```

<!-- CONTRIBUTING -->

## Contributing

Wanna contribute to the project? Great! Please follow the next steps in order to submit any feature or bug-fix:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
