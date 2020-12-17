import { useTheme } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"

const useIsSp = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return fullScreen
}

export default useIsSp