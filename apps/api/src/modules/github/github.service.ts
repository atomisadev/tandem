import { resolveProjectReferencePath } from "typescript";
import { prisma } from "../../common/db";
import { Octokit } from "octokit";

export class GithubService {
  private static async getAccessToken(userId: string) {
    const account = await prisma.account.findFirst({
      where: {
        userId,
        providerId: "github",
      },
    });

    if (!account || !account.accessToken) {
      throw new Error("No Github account linked");
    }

    return account.accessToken;
  }

  static async getOwners(userId: string) {
    const token = await this.getAccessToken(userId);
    const octokit = new Octokit({ auth: token });

    const [user, orgs] = await Promise.all([
      octokit.rest.users.getAuthenticated(),
      octokit.rest.orgs.listForAuthenticatedUser(),
    ]);

    return [
      {
        login: user.data.login,
        avatarUrl: user.data.avatar_url,
        type: "User",
        id: user.data.id,
      },
      ...orgs.data.map((org) => ({
        login: org.login,
        avatarUrl: org.avatar_url,
        type: "Organization",
        id: org.id,
      })),
    ];
  }

  static async getRepos(userId: string, owner: string) {
    const token = await this.getAccessToken(userId);
    const octokit = new Octokit({ auth: token });

    const user = await octokit.rest.users.getAuthenticated();

    let repos;

    if (owner === user.data.login) {
      repos = await octokit.rest.repos.listForAuthenticatedUser({
        visibility: "all",
        sort: "updated",
        per_page: 100,
        affiliation: "owner,collaborator,organization_member",
      });
    } else {
      repos = await octokit.rest.repos.listForOrg({
        org: owner,
        sort: "updated",
        per_page: 10,
      });
    }

    return repos.data.map((repo) => ({
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      url: repo.html_url,
    }));
  }
}
