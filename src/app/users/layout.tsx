
import getUsers from "../actions/getUser";
import Sidebar from "../components/sidebar/SideBar"
import UserList from "./components/UserList";

export default async function UsersLayout({ children }: { 
    children: React.ReactNode
 }) {
  const users = await getUsers()
  return (
    // @ts-expect-error Server Component
    <Sidebar>
    <div className="h-full">
      <UserList items = {users}/>
        {children}
    </div>
    </Sidebar>
  );
}