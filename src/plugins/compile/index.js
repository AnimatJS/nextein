
import { plugins } from '../config'

export function compile () {
  const sources = []
  const builders = []
  const transformers = []
  const cleaners = []
  const filters = []

  for (const plugin of plugins()) {
    const { resolved, options = {} } = plugin
    const { source, build, transform, cleanup, filter } = require(resolved)
    if (source) {
      sources.push((...args) => source(options, ...args))
    }
    if (build) {
      builders.push((...args) => build(options, ...args))
    }
    if (transform) {
      transformers.push((...args) => transform(options, ...args))
    }
    if (cleanup) {
      cleaners.push((...args) => cleanup(options, ...args))
    }
    if (filter) {
      filters.push((...args) => filter(options, ...args))
    }
  }

  return {
    sources,
    builders,
    transformers,
    cleaners,
    filters
  }
}
