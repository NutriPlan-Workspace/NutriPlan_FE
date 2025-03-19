import { CiLogout } from 'react-icons/ci';
import {
  FaRegBookmark,
  FaRegCalendarAlt,
  FaRegClock,
  FaRegCompass,
  FaRegUser,
  FaSearch,
} from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa6';
import { FaRegPaperPlane } from 'react-icons/fa6';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { FiSliders } from 'react-icons/fi';
import { GiCoffeeCup } from 'react-icons/gi';
import { IoPieChartOutline } from 'react-icons/io5';
import { LuChartNoAxesColumn } from 'react-icons/lu';
import { MdShoppingBasket } from 'react-icons/md';
import { Link } from '@tanstack/react-router';
import type { MenuProps } from 'antd';

import { PATH } from '@/constants/path';
import { cn } from '@/helpers/helpers';

type MenuItem = Required<MenuProps>['items'][number];
const iconClass = 'text-[18px]';

export const fullMenuItems: MenuItem[] = [
  {
    key: PATH.MEAL_PLAN,
    label: <Link to={PATH.MEAL_PLAN}>Planner</Link>,
    icon: <FaRegCalendarAlt className={iconClass} />,
  },
  {
    key: PATH.GROCERIES,
    label: <Link to={PATH.GROCERIES}>Groceries</Link>,
    icon: <MdShoppingBasket className={iconClass} />,
  },
  {
    key: PATH.DISCOVER,
    label: <Link to={PATH.DISCOVER}>Discover</Link>,
    icon: <FaSearch className={iconClass} />,
    className: 'mb-4',
  },
  {
    key: PATH.CUSTOM_RECIPES,
    label: <Link to={PATH.CUSTOM_RECIPES}>Custom Recipes</Link>,
    icon: <GiCoffeeCup className={iconClass} />,
  },
  {
    key: PATH.COLLECTIONS,
    label: <Link to={PATH.COLLECTIONS}>Collections</Link>,
    icon: <FaRegStar className={iconClass} />,
  },
  {
    key: PATH.SAVED_PLANS,
    label: <Link to={PATH.SAVED_PLANS}>Saved Plans</Link>,
    icon: <FaRegBookmark className={iconClass} />,
    className: 'mb-4',
  },
  {
    key: PATH.DIET_NUTRITION,
    label: 'Diet & Nutrition',
    icon: <IoPieChartOutline className={iconClass} />,
    children: [
      {
        key: PATH.NUTRITION_TARGETS,
        label: <Link to={PATH.NUTRITION_TARGETS}>Nutrition Targets</Link>,
      },
      {
        key: PATH.PRIMARY_DIET,
        label: <Link to={PATH.PRIMARY_DIET}>Primary Diet</Link>,
      },
      {
        key: PATH.FOOD_EXCLUSIONS,
        label: <Link to={PATH.FOOD_EXCLUSIONS}>Food Exclusions</Link>,
      },
      {
        key: PATH.RATED_FOODS,
        label: <Link to={PATH.RATED_FOODS}>Rated Foods</Link>,
      },
    ],
  },
  {
    key: PATH.MEALS_SCHEDULE,
    label: 'Meals & Schedule',
    icon: <FaRegClock className={iconClass} />,
    children: [
      {
        key: PATH.MEAL_SETTINGS,
        label: <Link to={PATH.MEAL_SETTINGS}>Meal Settings</Link>,
      },
      {
        key: PATH.LEFTOVERS,
        label: <Link to={PATH.LEFTOVERS}>Leftovers</Link>,
      },
    ],
  },
  {
    key: PATH.PHYSICAL_STATS,
    label: <Link to={PATH.PHYSICAL_STATS}>Physical Stats</Link>,
    icon: <LuChartNoAxesColumn className={iconClass} />,
  },
  {
    key: PATH.WEIGHT_GOAL,
    label: <Link to={PATH.WEIGHT_GOAL}>Weight and Goal</Link>,
    icon: <FaRegCompass className={iconClass} />,
  },
  {
    key: PATH.GENERATOR_SETTINGS,
    label: <Link to={PATH.GENERATOR_SETTINGS}>Generator Settings</Link>,
    icon: <FiSliders />,
    className: 'mb-4',
  },
  {
    key: PATH.ACCOUNT,
    label: 'Account',
    icon: <FaRegUser className={iconClass} />,
    children: [
      {
        key: PATH.CREDENTIALS,
        label: <Link to={PATH.CREDENTIALS}>Credentials</Link>,
      },
      {
        key: PATH.FAMILY_MEMBERS,
        label: <Link to={PATH.FAMILY_MEMBERS}>Family Members</Link>,
      },
      {
        key: PATH.NOTIFICATIONS,
        label: <Link to={PATH.NOTIFICATIONS}>Notifications</Link>,
      },
      {
        key: PATH.SUBSCRIPTION,
        label: <Link to={PATH.SUBSCRIPTION}>Subscription</Link>,
      },
    ],
  },
  {
    key: PATH.INVITE_FRIENDS,
    label: <Link to={PATH.INVITE_FRIENDS}>Invite Friends</Link>,
    icon: <FaRegPaperPlane className={iconClass} />,
  },
  {
    key: PATH.HELP,
    label: <Link to={PATH.HELP}>Help</Link>,
    icon: <FaRegCircleQuestion className={iconClass} />,
    className: 'mb-4',
  },
  {
    key: PATH.LOGOUT,
    label: 'Log Out',
    icon: <CiLogout className={cn('rotate-180', iconClass)} />,
  },
];

const collapsedIconClass = 'text-[24px]';
const collapsedLinkClass = 'flex flex-col items-center gap-2';

export const collapsedMenuItems: MenuItem[] = [
  {
    key: PATH.MEAL_PLAN,
    label: (
      <Link to={PATH.MEAL_PLAN} className={collapsedLinkClass}>
        <FaRegCalendarAlt className={collapsedIconClass} />
      </Link>
    ),
  },
  {
    key: PATH.GROCERIES,
    label: (
      <Link to={PATH.GROCERIES} className={collapsedLinkClass}>
        <MdShoppingBasket className={collapsedIconClass} />
      </Link>
    ),
  },
  {
    key: PATH.DISCOVER,
    label: (
      <Link to={PATH.DISCOVER} className={collapsedLinkClass}>
        <FaSearch className={collapsedIconClass} />
      </Link>
    ),
  },
];
