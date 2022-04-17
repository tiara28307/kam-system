import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { createPopper } from "@popperjs/core";
import { UserService } from "src/app/services/user.service";
import { LogoutAlert } from "src/constants/alerts.constant";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
  host: {
    "(window:click)": "closeDropdown()"
  }
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  settingsLink: string;

  constructor(
    private userService: UserService
  ) {}

  ngAfterViewInit() {
    this.settingsLink = this.userService.settingsLink;
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
    event.stopPropagation();
  }

  onLogout(): void {
    LogoutAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.userService.logoutUser();
        }
      });
  }

  closeDropdown() {
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    }
  }
}
