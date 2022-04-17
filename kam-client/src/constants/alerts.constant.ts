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
  title: 'Reset Password Error',
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
    let passwordPattern = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/);
    let isValid = passwordPattern.test(pass)
    if (!isValid) {
      return 'Invalid password. Must contains: 8 char, 1 num, 1 special, 1 upper ,and 1 lower';
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

let DoNotHavePermissionToServiceAlert = (service) => Swal.mixin({
  title: 'Sorry',
  text: `You do not have access to ${service} service`,
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.warning,
  icon: 'warning'
});

// Application Alerts
let ApplicationNotCompleteAlert = Swal.mixin({
  title: 'Application Not Complete',
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

let FailedFileUploadAlert = (err: string) => Swal.mixin({
  title: 'Failed to Upload File',
  text: err,
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

let FailedCreateApplicationAlert = (err: Error) => Swal.mixin({
  title: 'Failed to Create Application',
  text: err.message || JSON.stringify(err),
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

let ApplicationSavedAlert = Swal.mixin({
  title: 'Application Saved',
  toast: true,
  position: 'top-end',
  showCloseButton: true,
  showConfirmButton: false,
  iconColor: colors.success,
  icon: 'success'
});

let FailedSaveApplicationAlert = (err: Error) => Swal.mixin({
  title: 'Failed to Save Application',
  text: err.message || JSON.stringify(err),
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

let DeleteApplicationAlert = Swal.mixin({
  title: 'Delete Application',
  text: 'Are you sure you want to delete your application?',
  confirmButtonText: 'Yes',
  confirmButtonColor: colors.error,
  showCancelButton: true,
  iconColor: colors.theme,
  icon: 'question'
});

let ApplicationDeletedAlert = Swal.mixin({
  title: 'Application Deleted',
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.success,
  icon: 'success'
});

let FailedDeleteApplicationAlert = (err: Error) => Swal.mixin({
  title: 'Failed to Delete Application',
  text: err.message || JSON.stringify(err),
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

// Settings Alerts
let ChangePasswordAlert = Swal.mixin({
  title: 'Change Password',
  text: 'Are you sure you want to change your password? You will need to log back in.',
  confirmButtonText: 'Change Password',
  confirmButtonColor: colors.error,
  showCancelButton: true,
  iconColor: colors.theme,
  icon: 'question'
});

let FailedChangePasswordAlert = (err: Error) => Swal.mixin({
  title: 'Change Password Error',
  text: err.message || JSON.stringify(err),
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

let SuccessfulPasswordChangeAlert = Swal.mixin({
  title: 'Success!',
  text: 'Your password has been changed.',
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.success,
  icon: 'success'
});

let FailedUpdateAttributesAlert = (err: Error) => Swal.mixin({
  title: 'Update Account Error',
  text: err.message || JSON.stringify(err),
  confirmButtonText: 'Okay',
  confirmButtonColor: colors.theme,
  iconColor: colors.error,
  icon: 'error'
});

let SuccessfulAtrributesUpdateAlert = Swal.mixin({
  title: 'Account Updated',
  toast: true,
  position: 'top-end',
  showCloseButton: true,
  showConfirmButton: false,
  iconColor: colors.success,
  icon: 'success'
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
  DoNotHavePermissionToServiceAlert,
  ApplicationNotCompleteAlert,
  FailedFileUploadAlert,
  FailedCreateApplicationAlert,
  ApplicationSavedAlert,
  FailedSaveApplicationAlert,
  DeleteApplicationAlert,
  ApplicationDeletedAlert,
  FailedDeleteApplicationAlert,
  ChangePasswordAlert,
  FailedChangePasswordAlert,
  SuccessfulPasswordChangeAlert,
  FailedUpdateAttributesAlert,
  SuccessfulAtrributesUpdateAlert
}