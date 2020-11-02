import { queryHelpers, buildQueries } from '@testing-library/react'

const queryAllByDataDate = (...args) =>
  queryHelpers.queryAllByAttribute('data-date', ...args)

const getMultipleError = (c, dataDateValue) =>
  `Found multiple elements with the data-date attribute of: ${dataDateValue}`
const getMissingError = (c, dataDateValue) =>
  `Unable to find an element with the data-date attribute of: ${dataDateValue}`

const [
  queryByDataDate,
  getAllByDataDate,
  getByDataDate,
  findAllByDataDate,
  findByDataDate,
] = buildQueries(queryAllByDataDate, getMultipleError, getMissingError)

export {
  queryByDataDate,
  queryAllByDataDate,
  getByDataDate,
  getAllByDataDate,
  findAllByDataDate,
  findByDataDate,
}

