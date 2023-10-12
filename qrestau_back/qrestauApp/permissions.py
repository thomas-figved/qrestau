from rest_framework.permissions import BasePermission
from .models import Meal

class PermissionBase(BasePermission):
    group = ''

    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False
        if request.user.groups.filter(name=self.group):
            return True
        return False

class IsStaff(PermissionBase):
    group = "staff"


class IsMealUser(PermissionBase):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False

        if("meal_id" in view.kwargs):
            meal = Meal.objects.get(id=view.kwargs["meal_id"])
            if request.user == meal.anonymous_user and meal.is_closed == False:
                return True
            else:
                #user trying to access a different meal
                return False
        else:
            #check that at least one meal is open with the corresponding user
            meals = Meal.objects.filter(anonymous_user=request.user)

            if len(meals) > 0:
                return True

        return False