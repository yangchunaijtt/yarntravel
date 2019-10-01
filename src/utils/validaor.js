import VeeValidate, {
    Validator
  } from 'vee-validate';
  import zh_CN from 'vee-validate/dist/locale/zh_CN'
  import idCard  from 'idcard';
  zh_CN.attributes = {
    name: '姓名',
    email: '邮箱',
    cardid:'证件',
    mobile:'手机',
  }
  Validator.localize('zh_CN', zh_CN);
  
  Validator.extend('mobile', {
    getMessage: field => {
      return '手机格式不符合'
    },
    validate: (value,args) => {
      console.log('test',args);
      return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
  });
  Validator.extend('card', {
    getMessage: field => {
      return '身份证号码不正确'
    },
    validate: (value,args) => {
      console.log('身份证',args);
      if(args[0]=='ID_CARD'){
        return idCard.verify(value);
      }else{
          return true;
      }

      // return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
  });

  export default VeeValidate