
const ErrorText = ({ error }: { error?: string }) => {

    return (
        error ?
            <p className="text-red-500 text-sm mt-1.5 ml-1 font-medium">{error}</p>
            :
            null
    )
}

export default ErrorText