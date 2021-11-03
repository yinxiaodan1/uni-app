import { assert } from './testUtils'

describe('mp-kuaishou: transform v-on', () => {
  describe('input,textarea', () => {
    test(`input`, () => {
      assert(
        `<input @input="input"/>`,
        `<input bindinput="__e" data-e-o="{{a}}"/>`,
        `(_ctx, _cache) => {
  return { a: { 'input': _o(_ctx.input) } }
}`
      )
    })
    test(`textarea`, () => {
      assert(
        `<textarea @input="input"></textarea>`,
        `<textarea bindinput="__e" data-e-o="{{a}}"></textarea>`,
        `(_ctx, _cache) => {
  return { a: { 'input': _o(_ctx.input) } }
}`
      )
    })
  })
  describe('component', () => {
    test(`built-in event`, () => {
      assert(
        `<custom @tap="tap"/>`,
        `<custom bindtap="{{a}}" v-i="2a9ec0b0-0" bind:__l="__l"/>`,
        `(_ctx, _cache) => {
  return { a: _o(_ctx.tap) }
}`
      )
    })
    test(`custom event`, () => {
      assert(
        `<custom @click="click"/>`,
        `<custom bindclick="__e" v-i="2a9ec0b0-0" bind:__l="__l" eO="{{a}}"/>`,
        `(_ctx, _cache) => {
  return { a: { 'click': _o(_ctx.click) } }
}`
      )
    }),
      test(`multi custom event`, () => {
        assert(
          `<custom @unmount="unmount" @custom-mount="mount();created();"/>`,
          `<custom bindunmount="__e" bind:custom-mount="__e" v-i="2a9ec0b0-0" bind:__l="__l" eO="{{a}}"/>`,
          `(_ctx, _cache) => {
  return { a: { 'custom-mount': _o($event => { _ctx.mount(); _ctx.created(); }), 'unmount': _o(_ctx.unmount) } }
}`
        )
      })
  })
})
