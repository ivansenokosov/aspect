import type { IUser, ICompany, ICompanyUsers } from "@/interfaces"

export function getCompanyNameByUserId<String>(companies: ICompany[], companyUsers: ICompanyUsers[], userId: number):string {
    const record = companyUsers.find(item => item.user === userId)
    if (record) {
      const company = companies.find(item => item.id === record.company)
      if (company) {
        return company.name
      }
    } 
   
    return ''
}


export function getLoginByUserId(users: IUser[], userId: number):string {
  const user = users.find(item => item.id === userId)
  if (user && user.username) {
    return user.username
  }
  return ''
}
