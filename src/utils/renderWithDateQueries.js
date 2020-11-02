import { render, queries } from '@testing-library/react'
import * as dateQueries from './dataDateQueries'

const customRender = (ui, options) =>
  render(ui, { queries: { ...queries, ...dateQueries }, ...options })

export * from '@testing-library/react'

export { customRender as render }
