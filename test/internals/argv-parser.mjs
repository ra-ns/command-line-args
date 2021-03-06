import TestRunner from 'test-runner'
import a from 'assert'
import ArgvParser from '../../lib/argv-parser.mjs'

const tom = new TestRunner.Tom('argv-parser')

tom.test('long option, string', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = ['--one', '1']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' }
  ])
})

tom.test('long option, string repeated', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = ['--one', '1', '--one', '2']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  a.ok(result[3].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '2', name: 'one', value: '2' }
  ])
})

tom.test('long option, string multiple', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true }
  ]
  const argv = ['--one', '1', '2']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: '2', name: 'one', value: '2' }
  ])
})

tom.test('long option, string multiple then boolean', function () {
  const optionDefinitions = [
    { name: 'one', multiple: true },
    { name: 'two', type: Boolean }
  ]
  const argv = ['--one', '1', '2', '--two']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  a.ok(result[3].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: '2', name: 'one', value: '2' },
    { event: 'set', arg: '--two', name: 'two', value: true }
  ])
})

tom.test('long option, boolean', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = ['--one', '1']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(!result[1].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: true },
    { event: 'unknown_value', arg: '1', name: '_unknown', value: undefined }
  ])
})

tom.test('simple, with unknown values', function () {
  const optionDefinitions = [
    { name: 'one', type: Number }
  ]
  const argv = ['clive', '--one', '1', 'yeah']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(!result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  a.ok(!result[3].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'unknown_value', arg: 'clive', name: '_unknown', value: undefined },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: 'yeah', name: '_unknown', value: undefined }
  ])
})

tom.test('simple, with singular defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', type: Number },
    { name: 'two', defaultOption: true }
  ]
  const argv = ['clive', '--one', '1', 'yeah']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  a.ok(!result[3].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: 'clive', name: 'two', value: 'clive' },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: 'yeah', name: '_unknown', value: undefined }
  ])
})

tom.test('simple, with multiple defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', type: Number },
    { name: 'two', defaultOption: true, multiple: true }
  ]
  const argv = ['clive', '--one', '1', 'yeah']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  a.ok(result[3].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: 'clive', name: 'two', value: 'clive' },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: 'yeah', name: 'two', value: 'yeah' }
  ])
})

tom.test('long option, string lazyMultiple bad', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ]
  const argv = ['--one', '1', '2']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(!result[2].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: '2', name: '_unknown', value: undefined }
  ])
})

tom.test('long option, string lazyMultiple good', function () {
  const optionDefinitions = [
    { name: 'one', lazyMultiple: true }
  ]
  const argv = ['--one', '1', '--one', '2']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  a.ok(result[3].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '2', name: 'one', value: '2' }
  ])
})

tom.test('long option, stopAtFirstUnknown', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' }
  ]
  const argv = ['--one', '1', 'asdf', '--two', '2']
  const parser = new ArgvParser(optionDefinitions, { argv, stopAtFirstUnknown: true })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(!result[2].def)
  a.ok(!result[3].def)
  a.ok(!result[4].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: 'asdf', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '--two', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '2', name: '_unknown', value: undefined }
  ])
})

tom.test('long option, stopAtFirstUnknown with defaultOption', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ]
  const argv = ['1', 'asdf', '--two', '2']
  const parser = new ArgvParser(optionDefinitions, { argv, stopAtFirstUnknown: true })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(!result[1].def)
  a.ok(!result[2].def)
  a.ok(!result[3].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: 'asdf', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '--two', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '2', name: '_unknown', value: undefined }
  ])
})

tom.test('long option, stopAtFirstUnknown with defaultOption 2', function () {
  const optionDefinitions = [
    { name: 'one', defaultOption: true },
    { name: 'two' }
  ]
  const argv = ['--one', '1', '--', '--two', '2']
  const parser = new ArgvParser(optionDefinitions, { argv, stopAtFirstUnknown: true })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(!result[2].def)
  a.ok(!result[3].def)
  a.ok(!result[4].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' },
    { event: 'unknown_value', arg: '--', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '--two', name: '_unknown', value: undefined },
    { event: 'unknown_value', arg: '2', name: '_unknown', value: undefined }
  ])
})

tom.test('--option=value', function () {
  const optionDefinitions = [
    { name: 'one' },
    { name: 'two' }
  ]
  const argv = ['--one=1', '--two=2', '--two=']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '--one=1', name: 'one', value: '1' },
    { event: 'set', arg: '--two=2', name: 'two', value: '2' },
    { event: 'set', arg: '--two=', name: 'two', value: '' }
  ])
})

tom.test('--option=value, unknown option', function () {
  const optionDefinitions = [
    { name: 'one' }
  ]
  const argv = ['--three=3']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(!result[0].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'unknown_option', arg: '--three=3', name: '_unknown', value: undefined }
  ])
})

tom.test('--option=value where option is boolean', function () {
  const optionDefinitions = [
    { name: 'one', type: Boolean }
  ]
  const argv = ['--one=1']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'unknown_value', arg: '--one=1', name: '_unknown', value: undefined },
    { event: 'set', arg: '--one=1', name: 'one', value: true }
  ])
})

tom.test('short option, string', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' }
  ]
  const argv = ['-o', '1']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '-o', name: 'one', value: null },
    { event: 'set', arg: '1', name: 'one', value: '1' }
  ])
})

tom.test('combined short option, string', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' }
  ]
  const argv = ['-ot', '1']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(result[0].def)
  a.ok(result[1].def)
  a.ok(!result[2].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'set', arg: '-ot', subArg: '-o', name: 'one', value: null },
    { event: 'set', arg: '-ot', subArg: 't', name: 'one', value: 't' },
    { event: 'unknown_value', arg: '1', name: '_unknown', value: undefined }
  ])
})

tom.test('combined short option, one unknown', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' },
    { name: 'two', alias: 't' }
  ]
  const argv = ['-xt', '1']
  const parser = new ArgvParser(optionDefinitions, { argv })
  const result = Array.from(parser)
  a.ok(!result[0].def)
  a.ok(result[1].def)
  a.ok(result[2].def)
  result.forEach(r => delete r.def)
  a.deepStrictEqual(result, [
    { event: 'unknown_option', arg: '-xt', subArg: '-x', name: '_unknown', value: undefined },
    { event: 'set', arg: '-xt', subArg: '-t', name: 'two', value: null },
    { event: 'set', arg: '1', name: 'two', value: '1' }
  ])
})

tom.test('expandCluster, no whitespace value', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o' }
  ]
  const argv = ['-oone']
  const parser = new ArgvParser(optionDefinitions, { argv })
  a.strictEqual(parser.argv.length, 2)
  a.deepStrictEqual(parser.argv[0], { origArg: '-oone', arg: '-o' })
  a.deepStrictEqual(parser.argv[1], { origArg: '-oone', arg: 'one' })
})

tom.test('expandCluster, flags', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o', type: Boolean },
    { name: 'two', alias: 't', type: Boolean }
  ]
  const argv = ['-ot']
  const parser = new ArgvParser(optionDefinitions, { argv })
  a.strictEqual(parser.argv.length, 2)
  a.deepStrictEqual(parser.argv[0], { origArg: '-ot', arg: '-o' })
  a.deepStrictEqual(parser.argv[1], { origArg: '-ot', arg: '-t' })
})

tom.test('expandCluster, mix', function () {
  const optionDefinitions = [
    { name: 'one', alias: 'o', type: Boolean },
    { name: 'two', alias: 't' }
  ]
  const argv = ['-ot']
  const parser = new ArgvParser(optionDefinitions, { argv })
  a.strictEqual(parser.argv.length, 2)
  a.deepStrictEqual(parser.argv[0], { origArg: '-ot', arg: '-o' })
  a.deepStrictEqual(parser.argv[1], { origArg: '-ot', arg: '-t' })
})

tom.test('expand a cluster of short options with no definition', function () {
  const optionDefinitions = []
  const argv = ['-abc']
  const parser = new ArgvParser(optionDefinitions, { argv })
  a.strictEqual(parser.argv.length, 3)
  a.deepStrictEqual(parser.argv[0], { origArg: '-abc', arg: '-a' })
  a.deepStrictEqual(parser.argv[1], { origArg: '-abc', arg: '-b' })
  a.deepStrictEqual(parser.argv[2], { origArg: '-abc', arg: '-c' })
})

export default tom
