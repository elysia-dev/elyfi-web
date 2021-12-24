import { renderHook, act } from '@testing-library/react-hooks'
import usePositions from './usePositions'

const testOwner = "0x189027e3C77b3a92fd01bF7CC4E6a86E77F5034E"

test('should return 1', async () => {
  const { result } = renderHook(() => usePositions(testOwner))

  await act(async () => {
    result.current
    await result.current.fetchPositions();
  })

  expect(result.current.positions.length).toBe(1)
})