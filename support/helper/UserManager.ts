import { SSMClient, GetParametersByPathCommand} from '@aws-sdk/client-ssm'
import {generateToken} from '../../node_modules/authenticator'

const ssmClient = new SSMClient({region: process.env.AWS_REGION?? 'us-east-1'})

export default class UserManager{
    /**
     * To read user credentials in AWS
     * @param path - path to the parameter folder
     * @param name - name of the parameter
     */

    public static async getParameterByPath(path: string, name: string) {
      const command = new GetParametersByPathCommand({
        Path: path,
        Recursive: true,
        WithDecryption: true
      });
      let foundValue = ''
      try {
        const response = await ssmClient.send(command);
        if (response.Parameters) {
          response.Parameters.forEach(param => {
            if (param.Name === name){
              console.log(`Parameter found!`);
              foundValue = param.Value
            }
          });
        } else {
          console.log("No parameters found");
        }
      } catch (error) {
        console.error("Error fetching parameters:", error);
      }
      return foundValue === ''? console.error('Parameter not found') : foundValue;
    }

    public static async getBearerToken(name:string, path:string) {
      let var_name = name.toUpperCase()
      let token = ''
      if(process.env[var_name]){
          console.log(`Found saved token for ${var_name}`)
          token = process.env[var_name]
      }else{
          const token_name = `${path}/${name}`
          console.log(`this is the full path: ${token_name}`)
          let bearer_token = await this.getParameterByPath(path, token_name)
          if(bearer_token){
              process.env[var_name] = bearer_token
              token = process.env[var_name]
          }
      }
      return token
    }

    public static async getLoginCredentials(name:string, path:string) {
      let var_username = `${name.toUpperCase()}_USERNAME`
      let var_pass = `${name.toUpperCase()}_PASSCODE`
      let loginCredentials = []
      if(process.env[var_username]){
          console.log(`Found saved login credentials for ${var_username}`)
          loginCredentials = [ process.env[var_username], process.env[var_pass] ]
      }else{
          const credentials_name = `${path}/${name}`
          console.log(`this is the full path: ${credentials_name}`)
          let credentials = await UserManager.getParameterByPath(path, credentials_name)
          if(credentials){
              const [ username, passcode ] = credentials.split('---')
              process.env[var_username] = username
              process.env[var_pass] = passcode
              loginCredentials = [ username, passcode ]
          }
      }
      return loginCredentials
  }
  
  public static async get2FACode(name:string, path:string) {
      let var_name = `${name.toUpperCase()}_2FA_CODE`
      let otp = ''
      if(process.env[var_name]){
          console.log(`Found saved 2FA Code for ${var_name}`)
          otp = generateToken(process.env[var_name])
      }else{
          const credentials_name = `${path}/${name}_2fa`
          console.log(`this is the full path: ${credentials_name}`)
          let gaToken = await UserManager.getParameterByPath(path, credentials_name)
          if(gaToken){
              process.env[var_name] = gaToken
              otp = generateToken(process.env[var_name])
          }
      }
      return otp
  }
}
