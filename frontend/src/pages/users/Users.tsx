import { useEffect, useState } from 'react';
import { Users as UsersIcon, Search, Mail, Shield, Phone } from 'lucide-react';
import api from '../../services/api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.roles.some((role: string) =>
            role.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users');
      // Mock data for demo
      const mockUsers = [
        { id: '1', fullName: 'John Doe', email: 'john@example.com', roles: ['ADMIN'] },
        { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', roles: ['ORGANIZER'] },
        { id: '3', fullName: 'Bob Johnson', email: 'bob@example.com', roles: ['USER'] },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700';
      case 'ORGANIZER':
        return 'bg-blue-100 text-blue-700';
      case 'USER':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#0F172A] mb-2">Users</h1>
        <p className="text-[#64748B]">Manage all users in the system</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon className="h-16 w-16 text-[#E2E8F0] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No users found</h3>
            <p className="text-[#64748B]">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-justify text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Bio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#EA580C] flex items-center justify-center text-white font-semibold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{user.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role: string, index: number) => (
                          <span
                            key={index}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                              role
                            )}`}
                          >
                            <Shield className="h-3 w-3" />
                            {role.replace("ROLE_", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Phone className="h-4 w-4" />
                        {user.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B]">
                      {user.bio || 'No bio available'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!loading && filteredUsers.length > 0 && (
        <div className="text-center text-sm text-[#64748B]">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </div>
  );
}
