import request from '../api/axios';

export class UserService {
  static userProfile() {
    return request.get(`/api/login/userProfile/${localStorage.getItem('email')}`).then((res) => {
      let profile: any = {};
      try {
        profile = JSON.parse(res.body.profile);
      } catch (e) {}
      return {
        email: localStorage.getItem('email'),
        profile: {
          theme: profile.theme || 'light',
          primaryColor: profile.primaryColor || '#603BE3',
          fontSize: profile.fontSize || 'small',
          language: profile.language || 'en-US',
        },
      };
    });
  }

  static updateUserProfile(params) {
    return request.post(`/api/login/updateUserProfile`, params);
  }
}
