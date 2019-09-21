import { useEffect } from 'react'

const eventType = 'keydown'

const useKeydown = (key: string, callback: () => void) => {

  useEffect(() => {
    const bindHandler = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback()
      }
    }
    window.addEventListener(eventType, bindHandler)
    return () => {
      window.removeEventListener(eventType, bindHandler)
    };
  }, [key, callback])

}

export default useKeydown