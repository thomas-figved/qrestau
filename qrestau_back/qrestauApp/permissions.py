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
            if request.user == meal.anonymous_user:
                return True

        return False