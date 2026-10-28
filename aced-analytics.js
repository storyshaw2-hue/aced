(function (root) {
  'use strict';

  // CYCLE-0-BET slice 1: privacy-safe analytics outbound boundary.
  // Deliberately a source-code literal. No runtime or persisted override.
  const ACED_ANALYTICS_ENABLED = false;
  const ORIGIN = 'https://acedhq.com';
  const PATHS = Object.freeze({
    '/index.html': true,
    '/study.html': true,
    '/aced-arcade.html': true,
    '/importer.html': true,
    '/importer-classic.html': true,
    '/library.html': true,
    '/pricing.html': true
  });
  const RULES = Object.freeze({
    landing_viewed: {},
    demo_started: {},
    demo_finished: {},
    deck_compiled: {
      source: ['paste', 'file', 'doc'],
      count_bucket: ['1', '2-5', '6-20', '21-100', '101+']
    },
    run_started: { pack_kind: ['starter', 'library', 'user_pack', 'demo'] },
    run_finished: { pack_kind: ['starter', 'library', 'user_pack', 'demo'] },
    returned: { dayIndex: [1, 7], segment: ['byo', 'library', 'demo_only'] },
    byo_repeat: { days_bucket: ['1', '2', '3+'] },
    email_captured: { source: ['home'] },
    library_pack_started: {
      library_id: [
        'world-capitals', 'spanish-1k', 'cpa-far',
        'cpa-aud', 'cpa-reg', 'cpa-bar'
      ]
    }
  });

  // Returns a newly constructed, outbound-safe payload or null.
  // Does not read browser state or perform I/O.
  function validate(name, props, pagePath) {
    try {
      if (typeof name !== 'string' ||
          !Object.prototype.hasOwnProperty.call(RULES, name) ||
          typeof pagePath !== 'string' ||
          !Object.prototype.hasOwnProperty.call(PATHS, pagePath)) {
        return null;
      }

      const rule = RULES[name];
      const input = props === undefined ? {} : props;
      // Plain objects only, from any realm (iframe/vm-safe): the prototype
      // must be null or a root Object.prototype (whose own prototype is null).
      if (input === null || typeof input !== 'object' || Array.isArray(input)) {
        return null;
      }
      const proto = Object.getPrototypeOf(input);
      if (proto !== null && Object.getPrototypeOf(proto) !== null) {
        return null;
      }

      const expected = Object.keys(rule);
      const actual = Reflect.ownKeys(input);
      if (actual.length !== expected.length) return null;

      const safe = {};
      for (const key of expected) {
        if (!Object.prototype.hasOwnProperty.call(input, key)) return null;
        const descriptor = Object.getOwnPropertyDescriptor(input, key);
        if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value') ||
            !rule[key].includes(descriptor.value)) {
          return null;
        }
        safe[key] = descriptor.value;
      }

      return {
        domain: 'acedhq.com',
        name: name,
        url: ORIGIN + pagePath,
        props: safe
      };
    } catch (_) {
      return null;
    }
  }

  function emit(name, props, pagePath) {
    if (ACED_ANALYTICS_ENABLED !== true) return;
    const payload = validate(name, props, pagePath);
    if (!payload) return;

    try {
      const request = root.fetch('https://plausible.io/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit',
        referrerPolicy: 'no-referrer'
      });
      if (request && typeof request.catch === 'function') {
        request.catch(function () {});
      }
    } catch (_) {
      // Analytics must never affect gameplay or navigation.
    }
  }

  root.ACEDAnalytics = Object.freeze({
    enabled: ACED_ANALYTICS_ENABLED === true,
    emit: emit,
    validate: validate
  });
})(window);
