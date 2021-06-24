import { request } from 'common/utils/request'

export function getReportData_(){
  return request({
    method: 'get',
    url: 'reports/type/1',
  })
}