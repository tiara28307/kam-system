import { colors } from './colors.constant';
import Swal from 'sweetalert2';

let SuccessfulRegistrationAlert = Swal.mixin({
  title: 'Success!',
  text: 'Your account was created! Awaiting user approval.',
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.success,
  icon: 'success'
});

let FailedRegistrationAlert = (err: Error) => Swal.mixin({
  title: 'Error',
  text: err.message || JSON.stringify(err),
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

let EnterVerificationCodeAlert = Swal.mixin({
    title: 'Enter Verification Code',
    input: 'text',
    inputLabel: 'Verification code was sent to your email',
    inputPlaceholder: 'verification code',
    confirmButtonText: 'Verify',
    confirmButtonColor: colors.theme,
    showCloseButton: true,
});

let FailedResetPasswordAlert = (err: Error) => Swal.mixin({
  title: 'Error',
  text: err.message || JSON.stringify(err),
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

let EnterNewPasswordAlert = Swal.mixin({
  title: 'Enter New Password',
  input: 'password',
  inputPlaceholder: 'password',
  confirmButtonColor: colors.theme,
  confirmButtonText: 'Submit',
  showCloseButton: true,
  inputValidator: (pass) => {
    if (!pass) {
      return 'Please enter new password!';
    }
  }
});

let SuccessfulPasswordResetAlert = Swal.mixin({
  title: 'Success!',
  text: 'Your password has been reset.',
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.success,
  icon: 'success'
});

let LogoutAlert = Swal.mixin({
  title: 'Logout',
  text: 'Are you sure you want to logout?',
  confirmButtonText: 'Logout',
  confirmButtonColor: colors.error,
  showCancelButton: true,
  iconColor: colors.theme,
  icon: 'question'
});

export {
  SuccessfulRegistrationAlert,
  FailedRegistrationAlert,
  EnterVerificationCodeAlert,
  FailedResetPasswordAlert,
  EnterNewPasswordAlert,
  SuccessfulPasswordResetAlert,
  LogoutAlert
}