import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

/**
 * Custom hook to check user permissions for a specific page
 * @param {string} pageUrl - The URL of the page to check permissions for
 * @returns {Object} - Object containing permission flags
 */
export const usePermission = (pageUrl) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;
    const fetchPermissions = async () => {
      // If no user or no pageUrl, return with default permissions (all false)
      if (!user || !pageUrl) {
        if (isMounted) {
          setPermissions({
            canView: false,
            canAdd: false,
            canUpdate: false,
            canDelete: false,
            isLoading: false,
            error: null
          });
        }
        return;
      }

      try {
        // Get API URL from environment variables
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
          throw new Error('API URL is not defined');
        }

        // Fetch permissions from API
        const response = await axios.get(`${API_URL}/permissions`, {
          params: {
            userId: user.id,
            pageUrl
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Update permissions state if component is still mounted
        if (isMounted) {
          // If response is successful, assume user can view the page
          // and set other permissions based on response data
          setPermissions({
            canView: response.data.success === true, // User can view if API call was successful
            canAdd: response.data.has_add_right || false,
            canUpdate: response.data.has_update_right || false,
            canDelete: response.data.has_delete_right || false,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        
        // Update error state if component is still mounted
        if (isMounted) {
          setPermissions({
            canView: false,
            canAdd: false,
            canUpdate: false,
            canDelete: false,
            isLoading: false,
            error: error.message || 'Failed to fetch permissions'
          });
        }
      }
    };

    fetchPermissions();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [user, pageUrl]);

  return permissions;
};

export default usePermission;