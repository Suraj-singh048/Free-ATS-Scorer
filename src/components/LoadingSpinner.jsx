function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      <p className="mt-4 text-gray-600 font-medium">Analyzing resumes...</p>
      <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
    </div>
  );
}

export default LoadingSpinner;
