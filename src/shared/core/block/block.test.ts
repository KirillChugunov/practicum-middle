import Block from '@/shared/core/block/block.ts'

describe('Block', () => {
  class TestBlock extends Block {
    render(): string {
      return '<div class="test-block">Hello</div>'
    }
  }

  let block: TestBlock

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    block = new TestBlock('div', {})
  })

  test('должен рендериться', () => {
    block.renderToRoot('root')
    const el = document.querySelector('.test-block')
    expect(el).not.toBeNull()
    expect(el?.textContent).toBe('Hello')
  })

  test('должен обновлять props через setProps', () => {
    const spy = jest.spyOn(block as any, '_render')
    block.setProps({ value: '123' })
    expect(block.props.value).toBe('123')
    expect(spy).toHaveBeenCalled()
  })

  test('show() устанавливает display: block', () => {
    block.renderToRoot('root')
    block.hide()
    block.show()
    expect(block.getContent()?.style.display).toBe('block')
  })

  test('hide() устанавливает display: none', () => {
    block.renderToRoot('root')
    block.hide()
    expect(block.getContent()?.style.display).toBe('none')
  })

  test('должен навешивать события', () => {
    const onClick = jest.fn()
    const blockWithEvents = new TestBlock('button', {
      events: { click: onClick },
    })

    document.body.innerHTML = '<div id="root"></div>'
    blockWithEvents.renderToRoot('root')

    blockWithEvents.getContent()?.click()

    expect(onClick).toHaveBeenCalled()
  })
})
