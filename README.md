# Blackjack Ascent - Phase 2: Stage Progression & Advanced Actions

A roguelite blackjack card game built with Next.js 14, TypeScript, and Tailwind CSS. Phase 2 delivers the complete roguelite experience with stage progression, Double Down, Split, and full run flow from title screen to victory.

## New in Phase 2

### Stage Progression System
- **8 Progressive Stages**: Each with unique names and increasing difficulty
- **Win Requirements**: 3-6 wins needed per stage to advance
- **Visual Progress Bar**: Track your progress through each stage in real-time
- **Stage Names**: From "The Lobby" to "The Vault"

### Advanced Blackjack Actions
- **Double Down**: Double your bet on 2-card hands, receive one card, auto-stand
- **Split**: Split matching pairs into two independent hands
  - Play each hand separately with its own bet
  - Split Aces receive only one card each
  - Can double down after split (except on Aces)
  - Each hand resolves independently against dealer

### Complete Run Flow
- **Title Screen**: Polished main menu with "New Run" and "How to Play"
- **Stage Complete Screen**: Celebration with stats when clearing a stage
- **Game Over Screen**: Epitaph messages based on how far you got
- **Victory Screen**: Achievement badges and complete run statistics
- **Full Stats Tracking**: Hands played, win rate, streaks, blackjacks, and more

## Features

### Core Gameplay
- **Complete Blackjack**: Standard rules with dealer AI
- **Smart Hand Calculation**: Proper Ace handling (soft/hard hands)
- **Betting System**: Start with 50 chips, minimum bet of 5
- **Stage Progression**: Win hands to advance through 8 stages
- **Advanced Actions**: Hit, Stand, Double Down, Split

### Roguelite Elements
- **8-Stage Run**: Progress from Stage 1 (The Lobby) to Stage 8 (The Vault)
- **Win Requirements**: Each stage requires 3-6 wins to clear
- **Persistent Chips**: Your bankroll carries through all stages
- **Victory Condition**: Clear all 8 stages
- **Defeat Condition**: Run out of chips at any point

### Polish & UX
- **Casino Aesthetics**: Dark theme with gold accents
- **Smooth Animations**: Card flips, splits, celebrations
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Feedback**: Clear status messages and visual indicators
- **Achievement Badges**: Unlock special achievements on victory

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

### Build

```bash
npm run build
npm start
```

## How to Play

### Basic Flow
1. **Start a New Run**: Click "NEW RUN" from title screen
2. **Place Your Bet**: Choose from 5, 10, 25, 50, 100 chips or go All In
3. **Deal**: Click DEAL to start the hand
4. **Your Turn**: Choose your action
   - **HIT**: Take another card
   - **STAND**: Keep your hand and end your turn
   - **DOUBLE**: Double your bet, take one card, auto-stand (2-card hands only)
   - **SPLIT**: Split matching pairs into two hands
5. **Dealer Plays**: Dealer reveals hole card and plays by standard rules
6. **Resolution**: Win, lose, or push - chips updated automatically
7. **Progress**: Win hands to advance through stages
8. **Victory**: Clear all 8 stages to win!

### Game Rules

**Standard Blackjack:**
- Goal: Get closer to 21 than dealer without going over
- Number cards = face value
- Face cards (J, Q, K) = 10
- Aces = 11, but count as 1 if hand would bust
- Blackjack (Ace + 10-value card) pays 3:2

**Dealer Rules:**
- Must hit on 16 or less
- Must stand on 17 or more
- Does not play if player busts

**Double Down:**
- Only available on initial 2-card hands
- Doubles your bet
- Receive exactly one more card
- Automatically stand after receiving card
- Requires enough chips to double the bet

**Split:**
- Only available when initial 2 cards match rank
- Creates two separate hands from the pair
- Each hand gets its own bet (equal to original)
- Play each hand to completion independently
- Split Aces receive only one card each (no hitting)
- 21 after split is not blackjack (pays 1:1, not 3:2)
- Can double down after split (except on Aces)

**Payouts:**
- Win: 1:1 (get your bet back + equal amount)
- Blackjack: 3:2 (get your bet back + 1.5x bet)
- Lose: Lose your bet
- Push (tie): Bet returned

### Stage System

| Stage | Wins Required | Name |
|-------|---------------|------|
| 1 | 3 | The Lobby |
| 2 | 3 | Low Stakes |
| 3 | 4 | The Grind |
| 4 | 4 | Rising Heat |
| 5 | 5 | High Rollers |
| 6 | 5 | The Shark Tank |
| 7 | 6 | VIP Suite |
| 8 | 6 | The Vault |

**Progression:**
- Only wins count toward stage progress
- Losses and pushes don't set you back
- Chips persist between stages
- Clearing Stage 8 = Victory!
- Running out of chips = Game Over

## Project Structure

```
/app
  layout.tsx         # Root layout
  page.tsx           # Main routing logic
  globals.css        # Global styles

/components
  TitleScreen.tsx         # Main menu
  GameBoard.tsx           # Main game layout
  StageHeader.tsx         # Stage progress header
  StageCompleteScreen.tsx # Stage clear celebration
  GameOverScreen.tsx      # Defeat screen
  VictoryScreen.tsx       # Victory celebration
  Card.tsx                # Individual card
  Hand.tsx                # Card collection
  SplitHands.tsx          # Split hand display
  ChipDisplay.tsx         # Chip count
  BetControls.tsx         # Betting interface
  ActionButtons.tsx       # Hit/Stand/Double/Split
  GameStatus.tsx          # Status messages

/lib
  deck.ts            # Deck creation, shuffle, draw
  blackjack.ts       # Hand calculation, game logic
  stages.ts          # Stage definitions and helpers
  stats.ts           # Statistics tracking
  constants.ts       # Game constants

/store
  gameStore.ts       # Zustand state management

/types
  game.ts            # TypeScript interfaces
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Font**: Inter (Google Fonts)

## Phase 2 Checklist

✅ **Stage System**
- 8 progressive stages with unique names
- Win requirements per stage (3-6 wins)
- Stage progress tracking and display
- Stage complete celebration screen
- Victory screen after Stage 8

✅ **Double Down**
- Available only on 2-card hands
- Doubles bet correctly
- Deals exactly one card
- Auto-stands after card
- Win/loss calculated on doubled bet
- Disabled when insufficient chips

✅ **Split**
- Detects matching pairs correctly
- Splits into two independent hands
- Each hand has its own bet
- Active hand clearly indicated
- Both hands resolve against dealer
- Split Aces receive one card only
- Can double after split (except Aces)
- All edge cases handled

✅ **Run Flow**
- Title screen with New Run button
- Game progresses through stages
- Game over triggers at 0 chips
- Victory triggers after Stage 8
- Stats tracked throughout
- Screens feel polished

✅ **UI/UX**
- Stage progress always visible
- Action buttons appear/disappear correctly
- Split hands display clearly
- All animations smooth
- Responsive on all devices

## Edge Cases Handled

**Stage System:**
- Win on final hand triggers stage complete
- Lose all chips mid-stage goes to game over
- Push doesn't affect stage progress

**Double Down:**
- Double causing bust = immediate loss
- Can't afford double = button disabled
- Double in split hands works correctly

**Split:**
- Split Aces get one card each
- Split 10-values (10-J-Q-K) all work
- First hand busts = move to second hand
- Both hands bust = double loss
- Win one/lose one calculated correctly
- Push on one hand handled properly
- Blackjack after split pays 1:1 not 3:2
- Insufficient chips = button disabled

**Economy:**
- Bet suggestions based on last bet
- Can't bet more than chips
- Payouts always correct
- Chips never negative

## Future Phases

Phase 2 establishes the complete roguelite structure. Future phases will add:
- **Phase 3**: Powers, Relics, and Edge system
- Persistent unlocks
- Special cards and abilities
- Meta-progression

## Development

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## License

Private project - Phase 2 of Blackjack Ascent

---

**Phase 2 is complete!** You now have a full roguelite blackjack experience with stage progression, advanced actions, and polished screens. Play through all 8 stages and see if you can achieve victory! 🎰♠️♥️
