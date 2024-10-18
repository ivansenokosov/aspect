import type { IInvOptionDisount, IInvSerieDisount, ISimpleDictionary, IUserDiscount, ICompanyUsers, ICompany, IInvOption, IInvSerie } from "@/interfaces"
import { getValueFromDictionary } from "./getValueFromDictionary"

export function cutLastSymbol(inputString:string):string {
    return inputString.substring(0,inputString.length-1)
}

export function getDiscountSerie(serie_id: number, serieDiscounts : IInvSerieDisount []):string {
    if (serieDiscounts) {
        const serieDiscount = serieDiscounts.find((item : IInvSerieDisount) => item.serie_id === serie_id) 
        let discount:number = 0
        if (serieDiscount) {
          discount = serieDiscount.discount
          return Number(discount).toFixed().toString()
        }
    }
    return ''
}

export function getDiscountOption(option_id: number, optionDiscounts : IInvOptionDisount[]):string {
    if (optionDiscounts) {
    const optionDiscount = optionDiscounts.find((item : IInvOptionDisount) => item.option_id === option_id) 
        let discount:number = 0
        if (optionDiscount) {
            discount = optionDiscount.discount
            return Number(discount).toFixed().toString()
        }
    } 
    return ''
}

export function getInvPrice(price: number, serie_id: number, serieDiscounts : IInvSerieDisount [] ):number {
    if (serieDiscounts) {
        const serieDiscount = serieDiscounts.find((item : IInvSerieDisount) => item.serie_id === serie_id)!.discount
        return price * (100-serieDiscount)/100
    } else {
        return 0
    }
}

export function getOptionPrice(price: number, option_id: number, optionDiscounts : IInvOptionDisount[] ):number {
    if (optionDiscounts) {
        const optionDiscount = optionDiscounts.find((item : IInvOptionDisount) => item.option_id === option_id)!.discount 
        return price * (100-optionDiscount)/100
    } else {
        return 0
    }
}

export function getDiscountGroupNameByUserId(discountGroups: ISimpleDictionary[], IUserDiscountData: IUserDiscount[], userId: number) {
    const discountGroup = IUserDiscountData.find((item:IUserDiscount) => item.user_id === userId)
    if (discountGroup) {
      const groupName = discountGroups.find(item => item.id === discountGroup.group_id)
      if (groupName) {
        return groupName.name
      }
    }

    return ''
  }
// ---------------------------------------------------------------------  Возвращает список серий через заяптую по набору id серий ---------------------------------------------------
export function getSerieNames(series: IInvSerie[], seriesStr:string) {
    let seriesNames:string = ''
    var temp = new Array();
    temp = seriesStr.split(",");
    for (let i=0; i<temp.length; i++) {
      seriesNames += getValueFromDictionary(series, Number(temp[i])) + ', '
    }
    seriesNames = seriesNames.substring(0, seriesNames.length - 2)
    return seriesNames
  }
// ---------------------------------------------------------------------  Возвращает название организации  ---------------------------------------------------
export function getCompanyName(companyUsersList: ICompanyUsers[], 
                               companiesList: ICompany[], 
                               userId:number, 
                               extra: boolean = false) {
    const user = companyUsersList.find((item:ICompanyUsers) => item.user_id === userId) // находим строку CompanyUser для этого пользователя
    if (user) { 
        const company = companiesList.find((item:ICompany) => item.id == user.company_id)
        if (company)
          return extra ? ('<a class="font-bold">' + company.name + '</a><p>' + company.phone + '</p>') : company.name
    } 
    return ''
  }

  export function getOptionNames(options: IInvOption[], selectedOptions:string) {
    let result: string = ''
    if (selectedOptions.length>2) {
      var optionDict : string[]
      optionDict = JSON.parse(selectedOptions)
      optionDict.map((item : string) => {
        result = result + getValueFromDictionary(options, Number(item)) + '<br/>'
      })
    }
    return result
  }

//   export function getCompanyName(userId: number) {
//     const record = companyUsers.value.data.filter(item => item.user === userId)
//     const user = users.value.data.filter (item => item.id === userId)
//     if (record.length > 0) {
//       const company = companies.value.data.filter(item => item.id === record[0].company)
//       return '<a class="font-bold">' + company[0].name + '</a><p>' + user[0].first_name + '</p><p>' + company[0].phone + '</p>'
//     }
//     return ''
//   }


