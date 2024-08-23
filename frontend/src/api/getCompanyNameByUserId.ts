import type { IUser, ICompany, ICompanyUsers, ISimpleDictionary, IUserDiscount } from "@/interfaces"

export function getCompanyNameByUserId<String>(companies: ICompany[], companyUsers: ICompanyUsers[], userId: number) {
    const record = companyUsers.filter(item => item.user === userId)
    if (record.length > 0) {
      const company = companies.filter(item => item.id === record[0].company)
      return company[0].name
    }
    return ''
  }

export function getUserNameByUserId<String>(users: IUser[], companyUsers: ICompanyUsers[], userId: number) {
    const record = companyUsers.filter(item => item.user === userId)
    const user = users.filter (item => item.id === userId)
    return user[0].first_name
}

export function getLoginByUserId<String>(users: IUser[], userId: number) {
  const user = users.filter(item => item.id === userId)
  return user[0].username
}
