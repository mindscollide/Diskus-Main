import { useEffect } from 'react'

const PrintPage = () => {
  useEffect(() => {
    window.onload = function () {
      window.print()
    }
  }, [])

  return null // Return an empty component
}

export default PrintPage
