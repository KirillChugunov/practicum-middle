import router from '@/shared/core/router/router.ts'
import { Route } from '@/shared/core/router/route.ts'
import userStore from '@/store/userStore/userStore.ts'
import { Block } from '@shared'

class TestBlock extends Block {
  render(): string {
    return '<div>Test Block</div>';
  }
}

describe('Router — упрощённо, без синглтона', () => {
  beforeEach(() => {
    const RouterClass = router.constructor as any;
    RouterClass.__instance = null;

    window.history.pushState({}, '', '/');
  });

  test('use() добавляет маршрут', () => {
    router.use('/test', TestBlock, false);
    expect(router.getRoute('/test')).toBeInstanceOf(Route);
  });

  test('go() изменяет путь', () => {
    router.use('/page', TestBlock, false);
    router.start();
    router.go('/page');
    expect(window.location.pathname).toBe('/page');
  });

  test('back() и forward() работают', async () => {
    router.use('/one', TestBlock, false);
    router.use('/two', TestBlock, false);
    router.start();
    router.go('/one');
    router.go('/two');

    router.back();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(window.location.pathname).toBe('/one');

    router.forward();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(window.location.pathname).toBe('/two');
  });

  test('не пускает неавторизованных на защищённый маршрут', async () => {
    const original = userStore.getState;
    // @ts-expect-error
    userStore.getState = () => ({ isAuth: false });

    const root = document.createElement('div');
    root.id = 'app';
    document.body.innerHTML = '';
    document.body.appendChild(root);

    class PublicBlock extends Block {
      render(): string {
        return '<div id="public">Public Page</div>';
      }
    }

    class PrivateBlock extends Block {
      render(): string {
        return '<div id="private">Private Page</div>';
      }
    }

    router.use('/', PublicBlock, false);
    router.use('/private', PrivateBlock, true);
    router.start();
    router.go('/private');

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(document.getElementById('public')).not.toBeNull();
    expect(document.getElementById('private')).toBeNull();
    userStore.getState = original;
  });


});
