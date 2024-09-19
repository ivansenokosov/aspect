import type { IInvOptionDisount, IInvSerieDisount, ISimpleDictionary, IUserDiscount, ICompanyUsers, ICompany, IInvOption, IInvSerie } from "@/interfaces"
import { getValueFromDictionary } from "./getValueFromDictionary"

export function cutLastSymbol(inputString:string):string {
    return inputString.substring(0,inputString.length-1)
}

export function getDiscountSerie(serie: number, serieDiscounts : IInvSerieDisount []):string {
    if (serieDiscounts) {
        const serieDiscount = serieDiscounts.filter(item => item.serie === serie) 
        let discount:number = 0
        if (serieDiscount.length>0) {
          discount = serieDiscount[0].discount
          return Number(discount).toFixed().toString()
        }
    }
    return ''
}

export function getDiscountOption(option: number, optionDiscounts : IInvOptionDisount[]):string {
    if (optionDiscounts) {
    const optionDiscount = optionDiscounts.filter(item => item.option === option) 
        let discount:number = 0
        if (optionDiscount.length>0) {
            discount = optionDiscount[0].discount
            return Number(discount).toFixed().toString()
        }
    } 
    return ''
}

export function getInvPrice(price: number, serie: number, serieDiscounts : IInvSerieDisount [] ):number {
    if (serieDiscounts) {
        const serieDiscount = serieDiscounts.filter(item => item.serie === serie)[0].discount 
        return price * (100-serieDiscount)/100
    } else {
        return 0
    }
}

export function getOptionPrice(price: number, option: number, optionDiscounts : IInvOptionDisount[] ):number {
    if (optionDiscounts) {
        const optionDiscount = optionDiscounts.filter(item => item.option === option)[0].discount 
        return price * (100-optionDiscount)/100
    } else {
        return 0
    }
}

export function getDiscountGroupNameByUserId(discountGroups: ISimpleDictionary[], IUserDiscountData: IUserDiscount[], userId: number) {
    const discountGroup = IUserDiscountData.filter(item => item.user === userId)
    if (discountGroup.length>0) {
      const groupName = discountGroups.filter(item => item.id === discountGroup[0].group)
      if (groupName.length>0) {
        return groupName[0].name
      }
    }

    return ''
  }
// ---------------------------------------------------------------------  Возвращает список серий через заяптую по набору id серий ---------------------------------------------------
export function getSerieNames(series: IInvSerie[], seriesStr:string) {
    let seriesNames:String = ''
    var temp = new Array();
    temp = seriesStr.split(",");
    for (let i=0; i<temp.length; i++) {
      seriesNames += getValueFromDictionary(series, Number(temp[i])) + ', '
    }
    seriesNames = seriesNames.substring(0, seriesNames.length - 2)
    return seriesNames
  }

export function getCompanyName(companyUsersList: ICompanyUsers[], 
                               companiesList: ICompany[], 
                               userId:number, 
                               extra: boolean = false) {
    var  user     : ICompanyUsers[] 
    var  company  : ICompany 
    user = companyUsersList.filter(item => item.user === userId) // находим строку CompanyUser для этого пользователя
    if (user.length > 0) { 
        company = companiesList.filter((item:any) => item.id === user[0].company)[0]
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


