export interface Activity {
  id: string
  title: string
  durationMinutes: number
  supportText: string
  instructions: string[]
}

export interface FollowUpOption {
  key: string
  label: string
  activities: Activity[]
}

export interface MoodData {
  key: string
  label: string
  emoji: string
  catExpression: string
  catMessage: string
  followUpQuestion: string
  options: FollowUpOption[]
}

export const MOODS: MoodData[] = [
  {
    key: 'happy',
    label: 'Happy',
    emoji: '😸',
    catExpression: 'happy',
    catMessage: 'Your cat is doing a happy tail swish. Let\'s save this good moment.',
    followUpQuestion: 'What do you want to do with your happy feeling?',
    options: [
      {
        key: 'remember_it',
        label: 'Remember it',
        activities: [{
          id: 'happy_save_good_bit',
          title: 'Save the good bit',
          durationMinutes: 5,
          supportText: 'Good moments are worth keeping.',
          instructions: [
            'Write or draw one thing that made today good.',
            'Add one detail you want to remember.',
            'Read it back slowly.',
          ],
        }],
      },
      {
        key: 'share_it',
        label: 'Share it',
        activities: [{
          id: 'happy_kind_thing',
          title: 'Pass on a kind thing',
          durationMinutes: 5,
          supportText: 'Happy feelings can spread.',
          instructions: [
            'Think of one person.',
            'Say, write, or silently wish one kind thing for them.',
            'Notice how that feels.',
          ],
        }],
      },
      {
        key: 'use_energy',
        label: 'Use the energy',
        activities: [{
          id: 'happy_movement',
          title: 'Happy movement',
          durationMinutes: 5,
          supportText: 'Let\'s move with your happy feeling.',
          instructions: [
            'Dance, stretch, or move in a silly way.',
            'No rules — just move how you feel.',
            'Stop when you\'re ready.',
          ],
        }],
      },
      {
        key: 'keep_calm',
        label: 'Keep it calm',
        activities: [{
          id: 'happy_three_good_things',
          title: 'Three good things',
          durationMinutes: 5,
          supportText: 'Noticing good things helps them last longer.',
          instructions: [
            'Sit quietly.',
            'Notice three good things around you.',
            'Take one slow breath after each one.',
          ],
        }],
      },
    ],
  },
  {
    key: 'calm',
    label: 'Calm',
    emoji: '😌',
    catExpression: 'calm',
    catMessage: 'Your cat is curled up and peaceful. Let\'s help that calm feeling stay around.',
    followUpQuestion: 'What would you like to do with your calm feeling?',
    options: [
      {
        key: 'keep_it',
        label: 'Keep it',
        activities: [{
          id: 'calm_slow_cat_breathing',
          title: 'Slow cat breathing',
          durationMinutes: 5,
          supportText: 'Breathing slowly keeps calm feelings close.',
          instructions: [
            'Breathe in for 4 counts.',
            'Breathe out for 6 counts.',
            'Repeat slowly.',
          ],
        }],
      },
      {
        key: 'make_something',
        label: 'Make something',
        activities: [{
          id: 'calm_cosy_cat_den',
          title: 'Cosy cat den',
          durationMinutes: 5,
          supportText: 'Drawing a calm place can make it feel more real.',
          instructions: [
            'Draw a cosy cat den or peaceful place.',
            'Add one thing that makes it feel safe.',
            'No need to make it perfect.',
          ],
        }],
      },
      {
        key: 'notice_things',
        label: 'Notice things',
        activities: [{
          id: 'calm_quiet_noticing',
          title: 'Quiet noticing',
          durationMinutes: 5,
          supportText: 'There is something good in noticing.',
          instructions: [
            'Find five soft, quiet, or peaceful things nearby.',
            'Notice each one slowly.',
            'Take a breath between each.',
          ],
        }],
      },
      {
        key: 'get_ready',
        label: 'Get ready for later',
        activities: [{
          id: 'calm_one_small_prep',
          title: 'One small prep',
          durationMinutes: 5,
          supportText: 'One small thing can make tomorrow easier.',
          instructions: [
            'Choose one small thing to prepare for tomorrow or later today.',
            'Do only that one thing.',
            'Then rest.',
          ],
        }],
      },
    ],
  },
  {
    key: 'sad',
    label: 'Sad',
    emoji: '😿',
    catExpression: 'sad',
    catMessage: 'Your cat is sitting beside you quietly. You do not have to push the sadness away. Let\'s do one gentle thing.',
    followUpQuestion: 'What kind of help would feel best?',
    options: [
      {
        key: 'comfort',
        label: 'Comfort',
        activities: [{
          id: 'sad_cosy_pause',
          title: 'Cosy pause',
          durationMinutes: 5,
          supportText: 'Sometimes being still is the best thing.',
          instructions: [
            'Wrap yourself in something cosy if you can.',
            'Take 10 slow breaths.',
            'Stay still for a few minutes if you want.',
          ],
        }],
      },
      {
        key: 'talk',
        label: 'Talk to someone',
        activities: [{
          id: 'sad_safe_person',
          title: 'Choose a safe person',
          durationMinutes: 5,
          supportText: 'You do not have to carry this alone.',
          instructions: [
            'Think of one trusted person you could talk to.',
            'You do not have to talk now. Just choose who it could be.',
            'Remember they care about you.',
          ],
        }],
      },
      {
        key: 'tiny_task',
        label: 'Do a tiny task',
        activities: [{
          id: 'sad_tiny_helpful_thing',
          title: 'One tiny helpful thing',
          durationMinutes: 5,
          supportText: 'A tiny action can shift a heavy feeling.',
          instructions: [
            'Choose one: drink water, tidy one small thing, or step outside for a minute.',
            'Do only the tiny thing.',
            'That is enough.',
          ],
        }],
      },
      {
        key: 'let_out',
        label: 'Let the feeling out',
        activities: [{
          id: 'sad_draw_sadness',
          title: 'Draw the sadness',
          durationMinutes: 5,
          supportText: 'Giving a feeling a shape can help.',
          instructions: [
            'Draw sadness as a cloud, colour, shape, or cat face.',
            'No need to make it neat.',
            'When you\'re done, you can keep it or let it go.',
          ],
        }],
      },
    ],
  },
  {
    key: 'angry',
    label: 'Angry',
    emoji: '😾',
    catExpression: 'angry',
    catMessage: 'Your cat has puffed-up fur. That means pause first, act second. Let\'s cool things down safely.',
    followUpQuestion: 'What does your angry feeling need?',
    options: [
      {
        key: 'energy_out',
        label: 'Get energy out',
        activities: [{
          id: 'angry_safe_energy_burst',
          title: 'Safe energy burst',
          durationMinutes: 5,
          supportText: 'Moving big helps the angry energy find a way out.',
          instructions: [
            'Do 30 seconds of star jumps or running on the spot.',
            'Rest for a moment.',
            'Repeat safely for 5 minutes.',
          ],
        }],
      },
      {
        key: 'cool_down',
        label: 'Cool down',
        activities: [{
          id: 'angry_cooling_volcano_breath',
          title: 'Cooling volcano breath',
          durationMinutes: 5,
          supportText: 'Slow breathing can cool the heat of anger.',
          instructions: [
            'Breathe in slowly.',
            'Breathe out like cooling lava — long and slow.',
            'Make each out-breath a little longer.',
          ],
        }],
      },
      {
        key: 'say_safely',
        label: 'Say it safely',
        activities: [{
          id: 'angry_write_dont_send',
          title: 'Write it, don\'t send it',
          durationMinutes: 5,
          supportText: 'Writing it out can take the pressure off.',
          instructions: [
            'Write what you want to say.',
            'Do not send or show it yet.',
            'Read it back after a pause.',
          ],
        }],
      },
      {
        key: 'work_out',
        label: 'Work out what happened',
        activities: [{
          id: 'angry_what_sparked_it',
          title: 'What sparked it?',
          durationMinutes: 5,
          supportText: 'Understanding it can make it smaller.',
          instructions: [
            'Finish this: I felt angry when...',
            'Then finish: What I need now is...',
            'Read it back slowly.',
          ],
        }],
      },
    ],
  },
  {
    key: 'worried',
    label: 'Worried',
    emoji: '🙀',
    catExpression: 'worried',
    catMessage: 'Your cat is looking around carefully. Worries can feel loud. Let\'s make them smaller.',
    followUpQuestion: 'What kind of worry is it?',
    options: [
      {
        key: 'now_problem',
        label: 'A now problem',
        activities: [{
          id: 'worried_one_small_step',
          title: 'One small next step',
          durationMinutes: 5,
          supportText: 'One tiny step is always possible.',
          instructions: [
            'Write one small thing you can do next.',
            'Keep it tiny and possible.',
            'You only need to do that one thing.',
          ],
        }],
      },
      {
        key: 'later_problem',
        label: 'A later problem',
        activities: [{
          id: 'worried_worry_box',
          title: 'Worry box',
          durationMinutes: 5,
          supportText: 'Putting worries away for later can give you a break from them.',
          instructions: [
            'Imagine putting the worry in a box until later.',
            'Draw the box or write what is inside it.',
            'Close the lid.',
          ],
        }],
      },
      {
        key: 'big_what_if',
        label: 'A big "what if"',
        activities: [{
          id: 'worried_grounding_54321',
          title: '5-4-3-2-1 grounding',
          durationMinutes: 5,
          supportText: 'Noticing what is real can quiet what-ifs.',
          instructions: [
            'Name 5 things you can see.',
            'Name 4 things you can feel.',
            'Name 3 things you can hear.',
            'Name 2 things you can smell.',
            'Take 1 slow breath.',
          ],
        }],
      },
      {
        key: 'dont_know',
        label: 'I don\'t know what kind',
        activities: [{
          id: 'worried_hand_on_chest',
          title: 'Hand-on-chest breathing',
          durationMinutes: 5,
          supportText: 'Your breath is always there to come back to.',
          instructions: [
            'Put a hand on your chest or tummy.',
            'Take slow breaths.',
            'Notice the movement.',
          ],
        }],
      },
    ],
  },
  {
    key: 'low_energy',
    label: 'Low energy',
    emoji: '😴',
    catExpression: 'sleepy',
    catMessage: 'Your cat\'s battery is low. No big mission today. Just one small reset.',
    followUpQuestion: 'What kind of low energy is it?',
    options: [
      {
        key: 'sleepy',
        label: 'Sleepy',
        activities: [{
          id: 'low_quiet_reset',
          title: 'Quiet reset',
          durationMinutes: 5,
          supportText: 'Sometimes your body just needs a pause.',
          instructions: [
            'Dim the light if you can.',
            'Rest your eyes.',
            'Breathe slowly for 5 minutes.',
          ],
        }],
      },
      {
        key: 'bored',
        label: 'Bored',
        activities: [{
          id: 'low_mini_cat_challenge',
          title: 'Mini cat challenge',
          durationMinutes: 5,
          supportText: 'A tiny challenge can wake up a bored brain.',
          instructions: [
            'Draw a cat in 60 seconds.',
            'Add funny details for the rest of the time.',
            'No need for it to be good.',
          ],
        }],
      },
      {
        key: 'heavy_body',
        label: 'Heavy body',
        activities: [{
          id: 'low_gentle_stretch',
          title: 'Gentle stretch',
          durationMinutes: 5,
          supportText: 'Moving gently can shift a heavy feeling.',
          instructions: [
            'Slowly stretch neck, shoulders, back, arms, and legs.',
            'No forcing.',
            'Go as slow as you need.',
          ],
        }],
      },
      {
        key: 'nothing',
        label: 'Don\'t want to do anything',
        activities: [{
          id: 'low_smallest_action',
          title: 'Smallest possible action',
          durationMinutes: 5,
          supportText: 'The smallest thing still counts.',
          instructions: [
            'Choose one tiny action: sip water, sit up, open a window, or put one thing away.',
            'That is enough.',
            'Really.',
          ],
        }],
      },
    ],
  },
]

export const NOT_SURE_MOOD = {
  key: 'not_sure',
  label: 'Not sure',
  emoji: '🐱',
  catExpression: 'curious',
  catMessage: 'Sometimes feelings are fuzzy. Let\'s start with what your body is telling you.',
  followUpQuestion: 'That\'s okay. What do you notice most?',
  options: [
    {
      key: 'body_busy',
      label: 'My body feels busy',
      activities: [
        {
          id: 'angry_cooling_volcano_breath',
          title: 'Cooling volcano breath',
          durationMinutes: 5,
          supportText: 'Slow breathing can calm a busy body.',
          instructions: [
            'Breathe in slowly.',
            'Breathe out like cooling lava — long and slow.',
            'Make each out-breath a little longer.',
          ],
        },
        {
          id: 'calm_slow_cat_breathing',
          title: 'Slow cat breathing',
          durationMinutes: 5,
          supportText: 'Breathing slowly helps everything settle.',
          instructions: [
            'Breathe in for 4 counts.',
            'Breathe out for 6 counts.',
            'Repeat slowly.',
          ],
        },
      ],
    },
    {
      key: 'body_heavy',
      label: 'My body feels heavy',
      activities: [
        {
          id: 'low_gentle_stretch',
          title: 'Gentle stretch',
          durationMinutes: 5,
          supportText: 'Moving gently can shift a heavy feeling.',
          instructions: [
            'Slowly stretch neck, shoulders, back, arms, and legs.',
            'No forcing.',
            'Go as slow as you need.',
          ],
        },
        {
          id: 'low_smallest_action',
          title: 'Smallest possible action',
          durationMinutes: 5,
          supportText: 'The smallest thing still counts.',
          instructions: [
            'Choose one tiny action: sip water, sit up, open a window.',
            'That is enough.',
          ],
        },
      ],
    },
    {
      key: 'mind_noisy',
      label: 'My mind feels noisy',
      activities: [{
        id: 'worried_grounding_54321',
        title: '5-4-3-2-1 grounding',
        durationMinutes: 5,
        supportText: 'Noticing what is real can quiet a noisy mind.',
        instructions: [
          'Name 5 things you can see.',
          'Name 4 things you can feel.',
          'Name 3 things you can hear.',
          'Name 2 things you can smell.',
          'Take 1 slow breath.',
        ],
      }],
    },
    {
      key: 'okay_unsure',
      label: 'I feel okay but unsure',
      activities: [{
        id: 'calm_quiet_noticing',
        title: 'Quiet noticing',
        durationMinutes: 5,
        supportText: 'There is something good in noticing.',
        instructions: [
          'Find five soft, quiet, or peaceful things nearby.',
          'Notice each one slowly.',
          'Take a breath between each.',
        ],
      }],
    },
  ],
}

export const UNLOCK_THRESHOLDS: Record<number, string> = {
  3: 'blue_collar',
  5: 'star_background',
  10: 'cosy_blanket',
  15: 'fish_toy',
  20: 'wizard_hat',
  25: 'moon_background',
  30: 'sparkle_collar',
  40: 'cat_bed',
  50: 'crown',
}

export const ACCESSORY_LABELS: Record<string, string> = {
  blue_collar: 'Blue Collar',
  cosy_blanket: 'Cosy Blanket',
  fish_toy: 'Fish Toy',
  wizard_hat: 'Wizard Hat',
  sparkle_collar: 'Sparkle Collar',
  cat_bed: 'Cat Bed',
  crown: 'Crown',
}

export const BACKGROUND_LABELS: Record<string, string> = {
  star_background: 'Star Background',
  moon_background: 'Moon Background',
}

export const CAT_PATTERNS = [
  { key: 'ginger', label: 'Ginger', colors: { body: '#e8844a', belly: '#f5c49a', detail: '#c2622a' } },
  { key: 'black', label: 'Black', colors: { body: '#2a2a2a', belly: '#4a4a4a', detail: '#1a1a1a' } },
  { key: 'white', label: 'White', colors: { body: '#f0ece4', belly: '#ffffff', detail: '#d4cec4' } },
  { key: 'grey', label: 'Grey', colors: { body: '#8a8e94', belly: '#bbbfc4', detail: '#6a6e74' } },
  { key: 'tuxedo', label: 'Tuxedo', colors: { body: '#2a2a2a', belly: '#f5f5f5', detail: '#1a1a1a' } },
  { key: 'tabby', label: 'Tabby', colors: { body: '#b8895a', belly: '#e8c89a', detail: '#8a6040' } },
  { key: 'calico', label: 'Calico', colors: { body: '#e8c89a', belly: '#ffffff', detail: '#c8784a' } },
]
