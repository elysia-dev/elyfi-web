import { useContext, useMemo } from "react"
import MainnetContext from "src/contexts/MainnetContext"
import envs from "src/core/envs"
import MainnetType from "src/enums/MainnetType"

const useCurrentMoneypoolAddress = (): string => {
  const { type: getMainnetType } = useContext(MainnetContext)

  const currentMoneypoolAddress = useMemo(() => {
    return getMainnetType === MainnetType.BSC ? envs.bscMoneyPoolAddress : envs.moneyPoolAddress
  }, [getMainnetType])

  return currentMoneypoolAddress
}

export default useCurrentMoneypoolAddress;