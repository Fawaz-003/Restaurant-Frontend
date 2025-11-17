import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../Context/AppContext.jsx";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const {axios} = useAppContext();

  useEffect(() => {
     try {
    let res = axios.get("/api/users");

    if(res){
      setUsers(res.data.users);
    }

    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Users</h1>
      <table className="w-full mt-5 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role === 1 ? "Admin" : "User"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;