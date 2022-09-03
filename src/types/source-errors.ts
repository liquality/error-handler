import * as t from 'io-ts'

export const ONE_INCH_SOURCE_ERROR_TS = t.type({
  statusCode: t.number,
  error: t.string,
  description: t.string,
  requestId: t.string,
  meta: t.array(
    t.type(
      {
        type: t.string, 
        value: t.string
      }
    )
  ),
  name: t.string, // Chainify's hqtp client is used for one inch calls. Chainify returns a NodeError hence this extra field.)
});


export type OneInchSourceError = t.TypeOf<typeof ONE_INCH_SOURCE_ERROR_TS>