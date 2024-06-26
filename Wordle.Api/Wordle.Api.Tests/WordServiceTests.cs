﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Wordle.Api.Data;
using Wordle.Api.Services;

namespace Wordle.Api.Tests
{
    [TestClass]
    public class WordServiceTests : DatabaseTestBase
    {
        [TestMethod]
        public void GetWord()
        {
            using var context = new AppDbContext(Options);
            var service = new WordService(context);
            Word.SeedWords(context);

            var word = service.GetWord();

            Assert.IsNotNull(word);
            Assert.AreEqual(5, word.Text.Length);
        }
    }
}
