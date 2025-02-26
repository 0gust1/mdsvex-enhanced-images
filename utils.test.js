import { describe, it, expect } from 'vitest';
import { possibleAttributes, splitObjectByKeys, processAttributesAndConfig } from './utils';

describe('splitObjectByKeys', () => {
  it('should split object by given keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const keys = ['a', 'c'];
    const [included, excluded] = splitObjectByKeys(obj, keys);
    expect(included).toEqual({ a: 1, c: 3 });
    expect(excluded).toEqual({ b: 2, d: 4 });
  });

  it('should return empty included if no keys match', () => {
    const obj = { a: 1, b: 2 };
    const keys = ['c', 'd'];
    const [included, excluded] = splitObjectByKeys(obj, keys);
    expect(included).toEqual({});
    expect(excluded).toEqual({ a: 1, b: 2 });
  });

  it('should return empty excluded if all keys match', () => {
    const obj = { a: 1, b: 2 };
    const keys = ['a', 'b'];
    const [included, excluded] = splitObjectByKeys(obj, keys);
    expect(included).toEqual({ a: 1, b: 2 });
    expect(excluded).toEqual({});
  });
});

describe('processAttributesAndConfig', () => {
  it('should correctly parse and combine attributes and directives from URL and config', () => {
    const nodeUrl = './image.jpg?class=img-class;another-class&fetchpriority=high&custom=customValue';
    const config = {
      attributes: { loading: 'lazy', decoding: 'async' },
      imagetoolsDirectives: { blure: 3, rotate: 90 }
    };
    const result = processAttributesAndConfig(nodeUrl, config);
    expect(result.combinedClassesAttrStr).toBe('class="img-class another-class"');
    expect(result.combinedAttributesStr).toBe('loading="lazy" decoding="async" fetchpriority="high"');
    expect(result.combinedDirectivesUrlParams).toBe('&blure=3&rotate=90&custom=customValue');
  });

  it('should handle empty config (with url parameters)', () => {
    const nodeUrl = './image.jpg?class=img-class&fetchpriority=high';
    const result = processAttributesAndConfig(nodeUrl);
    expect(result.combinedClassesAttrStr).toBe('class="img-class"');
    expect(result.combinedAttributesStr).toBe('fetchpriority="high"');
    expect(result.combinedDirectivesUrlParams).toBe('');
  });

  it('should handle empty config and empty url parameters)', () => {
    const nodeUrl = './image.jpg';
    const result = processAttributesAndConfig(nodeUrl);
    expect(result.combinedClassesAttrStr).toBe('');
    expect(result.combinedAttributesStr).toBe('');
    expect(result.combinedDirectivesUrlParams).toBe('');
  });

  it('should handle empty config members and empty url parameters)', () => {
    const nodeUrl = './image.jpg';
    const config = {
      attributes: {},
      imagetoolsDirectives: {}
    };
    const result = processAttributesAndConfig(nodeUrl, config);
    expect(result.combinedClassesAttrStr).toBe('');
    expect(result.combinedAttributesStr).toBe('');
    expect(result.combinedDirectivesUrlParams).toBe('');
  });

  it('should handle empty URL parameters', () => {
    const nodeUrl = './image.jpg';
    const config = {
      attributes: { loading: 'lazy', decoding: 'async' },
      imagetoolsDirectives: { blur: 3, rotate: 90 }
    };
    const result = processAttributesAndConfig(nodeUrl, config);
    expect(result.combinedClassesAttrStr).toBe('');
    expect(result.combinedAttributesStr).toBe('loading="lazy" decoding="async"');
    expect(result.combinedDirectivesUrlParams).toBe('&blur=3&rotate=90');
  });

  it('should give precedence to URL parameters over config', () => {
    const nodeUrl = 'http://localhost/image.jpg?loading=eager&decoding=sync';
    const config = {
      attributes: { loading: 'lazy', decoding: 'async' }
    };
    const result = processAttributesAndConfig(nodeUrl, config);
    expect(result.combinedAttributesStr).toBe('loading="eager" decoding="sync"');
  });
});