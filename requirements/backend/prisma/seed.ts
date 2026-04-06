import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const words = [
    "cat", "dog", "house", "tree", "car", "sun", "moon", "star",
    "fish", "bird", "flower", "boat", "plane", "train", "bicycle",
    "apple", "banana", "pizza", "cake", "hat",
    "shoe", "chair", "table", "bed", "clock", "book", "phone",
    "computer", "key", "heart", "cloud", "rain", "snowman",
    "fire", "mountain", "river", "bridge", "castle", "crown",
    "ghost", "robot", "rocket", "ball", "guitar", "camera",
    "map", "flag", "ladder", "umbrella",

    "door", "window", "cup", "plate", "fork", "spoon", "knife",
    "bottle", "bag", "box", "gift", "candle", "lamp", "mirror",
    "pillow", "blanket", "soap", "toothbrush", "toothpaste",
    "towel", "comb", "brush", "helmet", "glasses", "watch",
    "ring", "necklace", "backpack", "wallet", "coin",

    "bus", "truck", "taxi", "subway", "scooter", "skateboard",
    "traffic light", "road", "garage",

    "beach", "island", "desert", "forest", "jungle", "lake",
    "ocean", "waterfall", "volcano", "cave", "hill", "valley",

    "cow", "horse", "sheep", "goat", "pig", "chicken", "duck",
    "frog", "turtle", "snake", "lizard", "butterfly", "bee",
    "ant", "spider", "mouse", "rabbit", "deer", "lion", "tiger",
    "bear", "elephant", "giraffe", "zebra", "monkey",

    "bread", "cheese", "egg", "milk", "juice", "coffee", "tea",
    "burger", "fries", "hot dog", "sandwich", "noodles",
    "rice", "soup", "salad", "cookie", "ice cream",

    "school", "teacher", "student", "classroom", "desk",
    "chalk", "board", "homework", "test", "pencil", "pen",
    "eraser", "notebook", "paper", "scissors", "glue",

    "doctor", "nurse", "hospital", "medicine", "bandage",
    "thermometer", "stethoscope",

    "police", "firefighter", "soldier", "chef", "artist",
    "musician", "driver", "pilot", "farmer", "builder",

    "park", "playground", "zoo", "museum", "library", "store",
    "market", "restaurant", "cafe", "hotel",

    "game", "puzzle", "dice", "card", "chess", "toy",
    "doll", "kite", "drum",

    "smile", "laugh", "cry", "sleep", "dream", "run", "jump",
    "swim", "dance", "sing", "clap", "wave", "hug", "kiss",

    "circle", "square", "triangle", "arrow",
    "spiral", "zigzag"
  ];

  await prisma.word.createMany({
	data: words.map((text) => ({ text })),
	skipDuplicates: true,
  });
  console.log("Seeded words");
  // Seed dummy users
//   const users = [
//     { nickname: 'dummy1', email: 'dummy1@example.com', password: 'password1' },
//     { nickname: 'dummy2', email: 'dummy2@example.com', password: 'password2' },
//     { nickname: 'dummy3', email: 'dummy3@example.com', password: 'password3' },
//     { nickname: 'dummy4', email: 'dummy4@example.com', password: 'password4' },
//     { nickname: 'dummy5', email: 'dummy5@example.com', password: 'password5' },
//   ];

//   // Hash passwords before inserting
//   const saltRounds = 12;
//   for (const user of users) {
//     const hashed = await bcrypt.hash(user.password, saltRounds);
//     await prisma.user.upsert({
//       where: { email: user.email },
//       update: {},
//       create: { ...user, password: hashed },
//     });
//   }

//   console.log('Seeded users');

}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});