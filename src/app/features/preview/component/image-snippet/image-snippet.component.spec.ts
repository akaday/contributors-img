import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { Repository } from '@api/shared/model/repository';
import { ImageSnippetComponent } from './image-snippet.component';

describe('ImageSnippetComponent', () => {
  let spectator: Spectator<ImageSnippetComponent>;
  const createComponent = createComponentFactory(ImageSnippetComponent);

  it('should create', () => {
    spectator = createComponent({
      props: { repository: new Repository('foo', 'bar') },
    });

    expect(spectator.component).toBeTruthy();
  });

  it('should generate image snippet', () => {
    spectator = createComponent({
      props: { repository: new Repository('foo', 'bar') },
    });

    expect(spectator.component.imageSnippet).toEqual(
      `
<a href="https://github.com/foo/bar/graphs/contributors">
  <img src="${location.origin}/image?repo=foo/bar" />
</a>

Made with [contributors-img](${location.origin}).
`.trim(),
    );
  });
});