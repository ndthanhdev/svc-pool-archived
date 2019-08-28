import{ useContext } from 'react'
import Context from '../components/Context'

export const usePluginPool = () => {
	return useContext(Context)
}

export default usePluginPool
