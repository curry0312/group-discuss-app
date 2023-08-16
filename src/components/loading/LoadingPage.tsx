import LoadingSpinner from "./LoadingSpinner"

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-950 z-50">
      <LoadingSpinner />
    </div>
  )
}

export default LoadingPage
