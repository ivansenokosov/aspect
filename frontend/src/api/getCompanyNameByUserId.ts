import type { IUser, ICompany, ICompanyUsers } from "@/interfaces"

export function getCompanyNameByUserId(companies: ICompany[], companyUsers: ICompanyUsers[], userId: number):string {
    const record = companyUsers.find((item :ICompanyUsers) => item.user_id === userId)
    if (record) {
      const company = companies.find((item : ICompany) => item.id === record.company_id)
      if (company) {
        return company.name
      }
    } 
   
    return ''
}


export function getLoginByUserId(users: IUser[], userId: number):string {
  const user = users.find((item : IUser) => item.id === userId)
  if (user && user.username) {
    return user.username
  }
  return ''
}
