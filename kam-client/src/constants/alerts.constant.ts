import { colors } from './colors.constant';
import Swal from 'sweetalert2';

// Registration Alerts
let SuccessfulRegistrationAlert = Swal.mixin({
  title: 'Success!',
  text: 'Your account was created! Awaiting admin approval.',
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

// Login Alerts
let FailedLoginAlert = (err: Error) => Swal.mixin({
  title: 'Error',
  text: err.message || JSON.stringify(err),
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

// Reset Password Alerts
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

// Logout Alerts
let LogoutAlert = Swal.mixin({
  title: 'Logout',
  text: 'Are you sure you want to logout?',
  confirmButtonText: 'Logout',
  confirmButtonColor: colors.error,
  showCancelButton: true,
  iconColor: colors.theme,
  icon: 'question'
});

// Permissions Alerts
let DoNotHavePermissionToPageAlert = Swal.mixin({
  title: 'Sorry',
  text: 'You do not have access to this page',
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.warning,
  icon: 'warning'
});

let DoNotHavePermissionToServiceAlert = Swal.mixin({
  title: 'Sorry',
  text: 'You do not have access to this service',
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.warning,
  icon: 'warning'
});

export {
  SuccessfulRegistrationAlert,
  FailedRegistrationAlert,
  EnterVerificationCodeAlert,
  FailedResetPasswordAlert,
  EnterNewPasswordAlert,
  SuccessfulPasswordResetAlert,
  LogoutAlert,
  DoNotHavePermissionToPageAlert,
  FailedLoginAlert,
  DoNotHavePermissionToServiceAlert
}