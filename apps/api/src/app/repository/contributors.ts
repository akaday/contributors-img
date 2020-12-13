import { Contributor, Repository } from '@lib/core';
import { Octokit } from '@octokit/rest';
import { injectable } from 'tsyringe';
import { CacheStorage } from '../service/cache-storage';
import { runWithTracing } from '../utils/tracing';

function createCacheKey(repository: Repository) {
  return `contributors-json-cache/${repository.owner}--${repository.repo}.json`;
}

@injectable()
export class ContributorsRepository {
  constructor(private readonly octokit: Octokit, private readonly cacheStorage: CacheStorage) {}

  async getAllContributors(repository: Repository): Promise<Contributor[]> {
    const cacheKey = createCacheKey(repository);
    const cached = await runWithTracing('restoreFromCache', () =>
      this.cacheStorage.restoreJSON<Contributor[]>(cacheKey),
    );
    if (cached) {
      return cached;
    }

    const contributors = await runWithTracing('fetchContributors', () =>
      this.octokit.paginate(this.octokit.repos.listContributors, {
        owner: repository.owner,
        repo: repository.repo,
        per_page: 100,
      }),
    );

    await runWithTracing('saveCache', () => this.cacheStorage.saveJSON(cacheKey, contributors));
    return contributors;
  }
}