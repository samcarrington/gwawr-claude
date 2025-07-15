import { describe, it, expect } from 'vitest'
import { sanitizeUrl } from './url'

describe('sanitizeUrl (utils folder colocated test)', () => {
  it('returns same value for https', () => {
    const url = 'https://example.com/page'
    expect(sanitizeUrl(url)).toBe(url)
  })

  it('returns same value for http', () => {
    const url = 'http://example.com/page'
    expect(sanitizeUrl(url)).toBe(url)
  })

  it('returns same value for relative path', () => {
    const url = '/docs/guide'
    expect(sanitizeUrl(url)).toBe(url)
  })

  it('sanitises javascript protocol', () => {
    const url = 'javascript:alert(1)'
    expect(sanitizeUrl(url)).toBe('#')
  })

  it('sanitises data protocol', () => {
    const url = 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='
    expect(sanitizeUrl(url)).toBe('#')
  })

  it('sanitises mixed-case javascript protocol', () => {
    const url = 'JaVaScRiPt:alert(1)'
    expect(sanitizeUrl(url)).toBe('#')
  })

  it('sanitises javascript preceded by whitespace', () => {
    const url = '   javascript:alert(1)'
    expect(sanitizeUrl(url)).toBe('#')
  })

  it('sanitises javascript followed by newline', () => {
    const url = 'javascript:\nalert(1)'
    expect(sanitizeUrl(url)).toBe('#')
  })

  it('sanitises chrome protocol', () => {
    const url = 'chrome://settings'
    expect(sanitizeUrl(url)).toBe('#')
  })
})
