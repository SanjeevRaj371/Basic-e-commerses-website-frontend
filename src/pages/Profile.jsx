import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loadUser, updateProfile } from '../store/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    // Ensure latest user data is loaded
    if (!user) {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(loadUser());
      }
    } else {
      reset({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, dispatch, reset]);

  const onSubmit = async (data) => {
    try {
      if (data.password && data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
      };

      if (data.password) {
        payload.password = data.password;
      }

      await dispatch(updateProfile(payload)).unwrap();
      toast.success('Profile updated successfully');
      reset({
        name: data.name.trim(),
        email: data.email.trim(),
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-gray-600 mt-1">
            Update your personal information and login details.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Change Password
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Leave password fields blank if you do not want to change your password.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...register('password', {
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      validate: (value) =>
                        !password || value === password || 'Passwords do not match',
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {user?.role && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Account Type:</span>{' '}
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

