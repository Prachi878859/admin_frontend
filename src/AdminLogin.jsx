import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from "./api/axiosInstance"
import Swal from 'sweetalert2';

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // REMOVE or COMMENT OUT this useEffect that auto-redirects
  // useEffect(() => {
  //   const token = localStorage.getItem('adminToken')
  //   if (token) {
  //     // If token exists, redirect to dashboard
  //     navigate('/dashboard')
  //   }
  // }, [navigate])

  // Keep only the remember me useEffect
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    const savedRememberMe = localStorage.getItem('rememberMe')
    
    if (savedEmail && savedRememberMe === 'true') {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axiosInstance.post('/admins/login', {
        Email: email,
        Password: password
      })
      
      console.log('Login successful:', response.data)
      
      // Store token in localStorage or context
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token)
        localStorage.setItem('adminData', JSON.stringify(response.data.admin))
        
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('savedEmail', email)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('savedEmail')
        }
      }
      
      // Show success message with SweetAlert
      await Swal.fire({
        title: 'Login Successful!',
        text: 'Welcome to Admin Dashboard',
        icon: 'success',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#2563eb',
        timer: 2000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
      
      // Reset form
      setEmail('')
      setPassword('')
      
      // Navigate to dashboard after successful login
      navigate('/dashboard')
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and try again.'
      setError(errorMessage)
      
      // Show error message with SweetAlert
      Swal.fire({
        title: 'Login Failed',
        html: `
          <div class="text-left">
            <p class="mb-2 text-gray-700">${errorMessage}</p>
            ${err.response?.data?.details ? 
              `<p class="mt-2 text-sm text-gray-500">${err.response.data.details}</p>` : 
              ''
            }
          </div>
        `,
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      })
      
      console.error('Login error:', err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  // Function for forgot password
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Reset Password',
      text: 'Enter your admin email address to receive a password reset link:',
      input: 'email',
      inputPlaceholder: 'Enter your admin email',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      confirmButtonColor: '#2563eb',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#6b7280',
      showLoaderOnConfirm: true,
      preConfirm: async (email) => {
        try {
          return email
        } catch (error) {
          Swal.showValidationMessage(
            `Request failed: ${error.response?.data?.message || error.message}`
          )
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    })

    if (email) {
      Swal.fire({
        title: 'Check Your Email',
        html: `
          <div class="text-center">
            <div class="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p class="text-gray-700">If an admin account exists with <strong>${email}</strong>, you will receive a password reset link shortly.</p>
            <p class="text-sm text-gray-500 mt-2">Please check your inbox and spam folder.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#2563eb'
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-8 sm:py-12">
      {/* Background decorative elements */}
      <div className="hidden lg:block fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl border border-gray-100">
        
        {/* Logo Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="mx-auto mb-4">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-2">
                Admin Login
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                Secure access to the administration dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg animate__animated animate__fadeIn">
            <div className="flex items-start sm:items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your admin email"
                className="w-full text-base pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full text-base pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
                disabled={loading}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition font-medium text-left sm:text-right"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Sign In</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
            )}
          </button>
        </form>

        {/* Additional Info Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin