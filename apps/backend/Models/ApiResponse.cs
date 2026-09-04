using System.Collections.Generic;

namespace BackendAPI.Models
{
    /// <summary>
    /// Standardized response wrapper for all API endpoints.
    /// Ensures a consistent structure for success and error payloads.
    /// </summary>
    /// <typeparam name="T">The type of the data payload.</typeparam>
    public class ApiResponse<T>
    {
        /// <summary>Indicates whether the request was successful.</summary>
        public bool Success { get; set; }
        /// <summary>The main payload returned by the endpoint.</summary>
        public T Data { get; set; }
        /// <summary>A human-readable message describing the outcome.</summary>
        public string Message { get; set; }
        /// <summary>A list of specific error messages if the request failed.</summary>
        public List<string> Errors { get; set; } = new List<string>();

        public static ApiResponse<T> SuccessResponse(T data, string message = "Success")
        {
            return new ApiResponse<T> { Success = true, Data = data, Message = message };
        }

        public static ApiResponse<T> ErrorResponse(string message, List<string> errors = null)
        {
            return new ApiResponse<T> { Success = false, Message = message, Errors = errors ?? new List<string>() };
        }
    }
}
